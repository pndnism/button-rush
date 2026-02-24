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
  const [showIntro, setShowIntro] = useState(true);
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
    setShowIntro(user.currentStage === 1);
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

      // ステージクリア判定 - 1個正解を見つけたらクリア
      if (isCorrect) {
        const nextStage = stageState.stageId + 1;

        if (nextStage > getMaxStage()) {
          setResultModal({ isOpen: true, type: 'gameClear' });
        } else {
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
      newUserState = resetToStage1(userState);
      nextStageId = 1;
    }

    setUserState(newUserState);
    saveUserState(newUserState);
    setStageState(createStageState(nextStageId));
    setResultModal({ isOpen: false, type: 'clear' });
  }, [userState, resultModal]);

  // Start game from intro
  const handleStartGame = () => {
    setShowIntro(false);
  };

  // ローディング中
  if (!userState || !stageState) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="grain fixed inset-0 z-10" />
      </div>
    );
  }

  // Intro Screen - シンプル版
  if (showIntro && stageState.stageId === 1) {
    return (
      <div className="min-h-screen bg-white relative flex flex-col items-center justify-center">
        <div className="grain fixed inset-0 z-10" />

        <main className="relative z-20 flex flex-col items-center px-6">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8">
            BUTTON QUEST
          </h1>

          {/* Giant Start Button */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-56 h-56 md:w-72 md:h-72 border-2 border-green-50 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute w-48 h-48 md:w-64 md:h-64 border-2 border-green-100 rounded-full" />

            <button
              onClick={handleStartGame}
              className="button-3d btn-green w-40 h-40 md:w-52 md:h-52 rounded-full flex flex-col items-center justify-center text-white z-30 animate-pulse-soft"
            >
              <span className="text-2xl md:text-3xl font-black tracking-tighter">START</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const buttonStates = getButtonStates();

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      <div className="grain fixed inset-0 z-10" />

      <StageInfo
        userState={userState}
        stageState={stageState}
      />

      {/* Main Game Canvas */}
      <main className="flex-1 flex flex-wrap content-center justify-center gap-3 md:gap-4 p-6 md:p-12 overflow-y-auto z-20">
        {buttonStates.map((state) => (
          <Button
            key={state.index}
            state={state}
            onPress={handlePressButton}
          />
        ))}
      </main>

      {/* Ad Modal */}
      <AdModal
        isOpen={showAdModal}
        onComplete={handleAdComplete}
        onClose={() => setShowAdModal(false)}
      />

      {/* Result Modal */}
      <ResultModal
        isOpen={resultModal.isOpen}
        type={resultModal.type}
        nextStage={resultModal.nextStage}
        onContinue={handleContinue}
      />
    </div>
  );
}
