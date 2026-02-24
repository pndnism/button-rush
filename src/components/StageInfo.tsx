'use client';

import { UserState, StageState } from '@/types';
import { getStageConfig, getMaxStage } from '@/lib/stage';

interface StageInfoProps {
  userState: UserState;
  stageState: StageState;
  onWatchAd: () => void;
  canPress: boolean;
}

export default function StageInfo({ userState, stageState, onWatchAd, canPress }: StageInfoProps) {
  const config = getStageConfig(stageState.stageId);
  const pressedCount = Object.keys(stageState.pressedButtons).length;
  const correctPressed = config.correctCount - stageState.remainingCorrect;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 text-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">
          Stage {stageState.stageId} / {getMaxStage()}
        </h2>
        <div className="text-sm text-gray-300">
          残り正解: <span className="text-green-400 font-bold">{stageState.remainingCorrect}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-400">ボタン数:</span>{' '}
          <span className="font-semibold">{config.buttonCount}</span>
        </div>
        <div>
          <span className="text-gray-400">正解数:</span>{' '}
          <span className="font-semibold">{config.correctCount}</span>
        </div>
        <div>
          <span className="text-gray-400">押下済み:</span>{' '}
          <span className="font-semibold">{pressedCount}</span>
        </div>
        <div>
          <span className="text-gray-400">発見済み:</span>{' '}
          <span className="font-semibold text-green-400">{correctPressed}</span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="flex justify-between items-center">
          <div>
            {!userState.usedFreePress ? (
              <span className="text-yellow-400">🎁 無料1回あり</span>
            ) : (
              <span>
                残り押下回数:{' '}
                <span className={`font-bold ${userState.remainingPresses > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {userState.remainingPresses}
                </span>
              </span>
            )}
          </div>
          {!canPress && userState.usedFreePress && (
            <button
              onClick={onWatchAd}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              📺 広告を見て+3回
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
