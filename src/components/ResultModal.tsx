'use client';

import { useEffect, useRef } from 'react';
import { Check, ArrowRight, Trophy, RefreshCw } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  type: 'clear' | 'reset' | 'gameClear';
  nextStage?: number;
  onContinue: () => void;
}

export default function ResultModal({ isOpen, type, nextStage, onContinue }: ResultModalProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || type !== 'gameClear' || !confettiRef.current) return;

    const container = confettiRef.current;
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ec4899', '#f97316'];

    const createConfetti = () => {
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.left = Math.random() * 100 + 'vw';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.width = (Math.random() * 8 + 4) + 'px';
          confetti.style.height = (Math.random() * 12 + 6) + 'px';
          confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
          confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
          container.appendChild(confetti);
          confetti.addEventListener('animationend', () => confetti.remove());
        }, i * 40);
      }
    };

    createConfetti();
    const interval = setInterval(createConfetti, 4000);
    return () => {
      clearInterval(interval);
      container.innerHTML = '';
    };
  }, [isOpen, type]);

  if (!isOpen) return null;

  // Stage Clear
  if (type === 'clear') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white">
        <div className="grain fixed inset-0 z-10" />

        <main className="relative z-20 flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-50 scale-150" />
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg relative z-10 float-slow">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8">
            CLEAR
          </h1>

          <button
            onClick={onContinue}
            className="button-3d btn-green px-12 py-4 flex items-center gap-3 text-white font-bold text-xl rounded-2xl"
          >
            Stage {nextStage}
            <ArrowRight className="w-5 h-5" />
          </button>
        </main>
      </div>
    );
  }

  // Reset
  if (type === 'reset') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white">
        <div className="grain fixed inset-0 z-10" />

        <main className="relative z-20 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            RESET
          </h1>

          <button
            onClick={onContinue}
            className="button-3d btn-blue px-10 py-4 flex items-center gap-2 text-white font-bold text-lg rounded-2xl"
          >
            <RefreshCw className="w-5 h-5" />
            Stage 1
          </button>
        </main>
      </div>
    );
  }

  // Game Clear
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white overflow-hidden">
      <div className="grain fixed inset-0 z-10" />
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-20" />

      <main className="relative z-30 flex flex-col items-center text-center">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150" />
          <div className="trophy-bounce">
            <Trophy className="w-20 h-20 md:w-28 md:h-28 text-yellow-400 drop-shadow-2xl" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-8">
          CHAMPION
        </h1>

        <button
          onClick={onContinue}
          className="button-3d btn-green px-12 py-4 flex items-center gap-2 text-white font-bold text-xl rounded-2xl"
        >
          <RefreshCw className="w-5 h-5" />
          REPLAY
        </button>
      </main>
    </div>
  );
}
