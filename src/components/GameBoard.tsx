'use client';

import { useState, useEffect, useCallback } from 'react';
import { StageState, UserState, ButtonState } from '@/types';
import { createStageState, getStageConfig, isCorrectButton, isButtonPressed, getMaxStage } from '@/lib/stage';
import {
  getOrCreateUserState,
  saveUserState,
  canPressButton,
  consumePress,
  grantPressesFromAd,
  advanceToStage,
  resetToStage1,
} from '@/lib/user';
import Button from './Button';
import StageInfo from './StageInfo';
import AdModal from './AdModal';
import ResultModal from './ResultModal';

export default function GameBoard() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [stageState, setStageState] = useState<StageState | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    type: 'clear' | 'reset' | 'gameClear';
    nextStage?: number;
  }>({ isOpen: false, type: 'clear' });

  // 初期化
  useEffect(() => {
    const user = getOrCreateUserState();
    setUserState(user);
    setStageState(createStageState(user.currentStage));
  }, []);

  // ボタンの状態を生成
  const getButtonStates = useCallback((): ButtonState[] => {
    if (!stageState) return [];

    return Array.from({ length: stageState.totalButtons }, (_, index) => {
      const pressed = stageState.pressedButtons[index];
      return {
        index,
        isCorrect: isCorrectButton(stageState, index),
        isPressed: isButtonPressed(stageState, index),
        pressedBy: pressed?.pressedBy,
        pressedAt: pressed?.pressedAt,
      };
    });
  }, [stageState]);

  // ボタン押下処理
  const handlePressButton = useCallback(
    (index: number) => {
      if (!userState || !stageState) return;

      // 押下可能かチェック
      if (!canPressButton(userState)) {
        setShowAdModal(true);
        return;
      }

      // 既に押されている場合は何もしない
      if (isButtonPressed(stageState, index)) return;

      const isCorrect = isCorrectButton(stageState, index);

      // ステージ状態を更新
      const newStageState: StageState = {
        ...stageState,
        pressedButtons: {
          ...stageState.pressedButtons,
          [index]: {
            isCorrect,
            pressedBy: userState.token,
            pressedAt: Date.now(),
          },
        },
        remainingCorrect: isCorrect ? stageState.remainingCorrect - 1 : stageState.remainingCorrect,
      };

      // ユーザー状態を更新（押下消費）
      const newUserState = consumePress(userState);
      setUserState(newUserState);
      saveUserState(newUserState);
      setStageState(newStageState);

      // ステージクリア判定
      if (isCorrect && newStageState.remainingCorrect === 0) {
        const nextStage = stageState.stageId + 1;

        if (nextStage > getMaxStage()) {
          // ゲームクリア
          setResultModal({ isOpen: true, type: 'gameClear' });
        } else {
          // 次のステージへ
          setResultModal({ isOpen: true, type: 'clear', nextStage });
        }
      }
    },
    [userState, stageState]
  );

  // 広告視聴完了
  const handleAdComplete = useCallback(() => {
    if (!userState) return;

    const newUserState = grantPressesFromAd(userState);
    setUserState(newUserState);
    saveUserState(newUserState);
    setShowAdModal(false);
  }, [userState]);

  // 結果モーダルからの続行
  const handleContinue = useCallback(() => {
    if (!userState) return;

    let newUserState: UserState;
    let nextStageId: number;

    if (resultModal.type === 'clear' && resultModal.nextStage) {
      newUserState = advanceToStage(userState, resultModal.nextStage);
      nextStageId = resultModal.nextStage;
    } else {
      // reset または gameClear の場合はステージ1へ
      newUserState = resetToStage1(userState);
      nextStageId = 1;
    }

    setUserState(newUserState);
    saveUserState(newUserState);
    setStageState(createStageState(nextStageId));
    setResultModal({ isOpen: false, type: 'clear' });
  }, [userState, resultModal]);

  // ローディング中
  if (!userState || !stageState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const buttonStates = getButtonStates();
  const config = getStageConfig(stageState.stageId);
  const canPress = canPressButton(userState);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          🎮 Button Rush
        </h1>

        <StageInfo
          userState={userState}
          stageState={stageState}
          onWatchAd={() => setShowAdModal(true)}
          canPress={canPress}
        />

        {/* ゲームボード */}
        <div
          className="grid gap-2 p-4 bg-gray-800 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${config.gridCols}, minmax(0, 1fr))`,
          }}
        >
          {buttonStates.map((state) => (
            <Button
              key={state.index}
              state={state}
              disabled={!canPress}
              onPress={handlePressButton}
            />
          ))}
        </div>

        {/* ステージ1のヒント */}
        {stageState.stageId === 1 && Object.keys(stageState.pressedButtons).length === 0 && (
          <div className="mt-4 p-4 bg-blue-900 bg-opacity-50 rounded-lg text-blue-200 text-sm text-center">
            💡 ヒント: ボタンを押して正解を探そう！ステージ1は1つだけボタンがあるチュートリアルです。
          </div>
        )}

        {/* 広告モーダル */}
        <AdModal
          isOpen={showAdModal}
          onComplete={handleAdComplete}
          onClose={() => setShowAdModal(false)}
        />

        {/* 結果モーダル */}
        <ResultModal
          isOpen={resultModal.isOpen}
          type={resultModal.type}
          nextStage={resultModal.nextStage}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}
