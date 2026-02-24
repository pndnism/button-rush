'use client';

import { useState, useEffect, useCallback } from 'react';
import { Info, MousePointer2 } from 'lucide-react';
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
    // Show intro only for stage 1
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

  // Start game from intro
  const handleStartGame = () => {
    setShowIntro(false);
  };

  // ローディング中
  if (!userState || !stageState) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="grain fixed inset-0 z-10" />
        <div className="text-gray-400 text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // Intro Screen (Stage 1 only)
  if (showIntro && stageState.stageId === 1) {
    return (
      <div className="min-h-screen bg-white relative flex flex-col items-center">
        <div className="grain fixed inset-0 z-10" />

        <main className="relative z-20 w-full max-w-4xl px-6 py-12 md:py-24 flex flex-col items-center">
          {/* Logo/Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
              <MousePointer2 className="w-3 h-3" />
              COLLECTIVE TACTILE EXPERIMENT
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4">
              BUTTON QUEST
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
              Find the correct buttons. Progress together.
              <br />
              Click the green button below to begin.
            </p>
          </div>

          {/* Giant Start Button */}
          <div className="relative flex items-center justify-center mb-24 md:mb-32">
            <div className="absolute w-64 h-64 md:w-80 md:h-80 border-2 border-green-50 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute w-56 h-56 md:w-72 md:h-72 border-2 border-green-100 rounded-full" />

            <button
              onClick={handleStartGame}
              className="button-3d btn-green w-44 h-44 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center text-white z-30 animate-pulse-soft"
            >
              <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none mb-1">PRESS</span>
              <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none">ME</span>
            </button>
          </div>

          {/* Rules */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-20">
            <div className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-400" />
                How it works
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center shrink-0 text-green-600 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Target the Correct</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Find all correct buttons among decoys to clear each stage.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center shrink-0 text-yellow-600 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Energy Management</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      First tap is free. Watch ads to earn more attempts.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center shrink-0 text-blue-600 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Progress Through Stages</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Clear 8 stages with increasing difficulty to win.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-8">The Journey</h3>
              <div className="space-y-6">
                {[
                  { stage: 1, name: 'Tutorial', buttons: 1 },
                  { stage: 2, name: 'Beginning', buttons: 4 },
                  { stage: 3, name: 'The Grid', buttons: 9 },
                  { stage: 4, name: 'Challenge', buttons: 25 },
                  { stage: 8, name: 'Final Boss', buttons: 100 },
                ].map((s, i) => (
                  <div key={s.stage} className="flex items-center gap-6">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        i === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {s.stage}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${i === 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s.name}
                      </h4>
                      <p className={`text-[10px] uppercase tracking-widest mt-0.5 ${i === 0 ? 'text-gray-400' : 'text-gray-300'}`}>
                        {s.buttons} button{s.buttons > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center opacity-40">
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
              System Connected // Instance ID: ALPHA-001
            </p>
          </div>
        </main>
      </div>
    );
  }

  const buttonStates = getButtonStates();
  const canPress = canPressButton(userState);

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      {/* Grain texture */}
      <div className="grain fixed inset-0 z-10" />

      {/* Stage Info Header */}
      <StageInfo
        userState={userState}
        stageState={stageState}
        onWatchAd={() => setShowAdModal(true)}
        canPress={canPress}
      />

      {/* Main Game Canvas */}
      <main className="flex-1 flex flex-wrap content-start justify-center gap-4 md:gap-6 p-8 md:p-12 lg:p-24 pt-32 md:pt-40 overflow-y-auto z-20">
        {buttonStates.map((state) => (
          <Button
            key={state.index}
            state={state}
            disabled={!canPress}
            onPress={handlePressButton}
          />
        ))}
      </main>

      {/* Info Button (Bottom Right) */}
      <div className="fixed bottom-8 right-8 z-50 group hidden md:block">
        <div className="absolute bottom-full right-0 mb-4 bg-black text-white p-4 rounded-2xl w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
          <p className="text-xs leading-relaxed">
            A collective button quest. Find all correct buttons to advance.
            Gray buttons have already been pressed. Press wisely.
          </p>
        </div>
        <button className="w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all shadow-sm">
          <Info className="w-5 h-5" />
        </button>
      </div>

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
