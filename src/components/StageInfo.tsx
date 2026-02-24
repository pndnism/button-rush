'use client';

import { Layers, Target } from 'lucide-react';
import { UserState, StageState } from '@/types';
import { getStageConfig } from '@/lib/stage';

interface StageInfoProps {
  userState: UserState;
  stageState: StageState;
}

export default function StageInfo({ stageState }: StageInfoProps) {
  const config = getStageConfig(stageState.stageId);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full border border-gray-100 shadow-sm flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-gray-500">
          <Layers className="w-4 h-4" />
          <span className="font-bold text-gray-900">{stageState.stageId}</span>
        </span>
        <span className="w-px h-4 bg-gray-200" />
        <span className="flex items-center gap-1.5 text-gray-500">
          <Target className="w-4 h-4" />
          <span className="font-bold text-green-600">{stageState.remainingCorrect}</span>
          <span className="text-gray-400">/ {config.correctCount}</span>
        </span>
      </div>
    </header>
  );
}
