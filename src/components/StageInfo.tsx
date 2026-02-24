'use client';

import { Layers, Target, BatteryMedium, Video } from 'lucide-react';
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
  const correctPressed = config.correctCount - stageState.remainingCorrect;

  // Calculate energy display
  const getEnergyDisplay = () => {
    if (!userState.usedFreePress) {
      return 1; // Free press available
    }
    return userState.remainingPresses;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-8 header-area">
      <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-100 shadow-lg flex flex-col items-center gap-1 cursor-default reveal-info">
        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-500" />
            STAGE
            <span className="text-gray-900 font-bold">{stageState.stageId}</span>
          </span>
          <span className="w-px h-4 bg-gray-200" />
          <span className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-green-500" />
            REMAINING
            <span className="text-gray-900 font-bold">
              {stageState.remainingCorrect} / {config.correctCount}
            </span>
          </span>
          <span className="w-px h-4 bg-gray-200" />
          <span className="flex items-center gap-1.5">
            <BatteryMedium className="w-4 h-4 text-orange-500" />
            ENERGY
            <span className={`font-bold ${getEnergyDisplay() > 0 ? 'text-gray-900' : 'text-red-500'}`}>
              {getEnergyDisplay()}
            </span>
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-gray-400">
          Find the correct buttons to proceed
        </div>
      </div>

      {/* Mobile-friendly energy bar */}
      <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center md:hidden">
        <div className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
          <span className="text-xs font-bold tracking-wider uppercase text-white/60">
            Stage {stageState.stageId}/{getMaxStage()}
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span className="text-xs font-bold">
            <span className={getEnergyDisplay() > 0 ? 'text-green-400' : 'text-red-400'}>
              {getEnergyDisplay()}
            </span>
            <span className="text-white/40"> energy</span>
          </span>
          {!canPress && userState.usedFreePress && (
            <>
              <span className="w-px h-4 bg-white/20" />
              <button
                onClick={onWatchAd}
                className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
              >
                <Video className="w-3 h-3" />
                +3
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop watch ad button */}
      {!canPress && userState.usedFreePress && (
        <div className="hidden md:block fixed top-8 right-8 z-50">
          <button
            onClick={onWatchAd}
            className="button-3d btn-yellow px-6 py-3 rounded-2xl text-black font-bold text-sm flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Watch Ad +3
          </button>
        </div>
      )}
    </header>
  );
}
