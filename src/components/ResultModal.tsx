'use client';

import { useEffect, useRef } from 'react';
import { Check, ArrowRight, Trophy, RefreshCw, Home, Share2 } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  type: 'clear' | 'reset' | 'gameClear';
  nextStage?: number;
  onContinue: () => void;
}

export default function ResultModal({ isOpen, type, nextStage, onContinue }: ResultModalProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  // Confetti effect for game clear
  useEffect(() => {
    if (!isOpen || type !== 'gameClear' || !confettiRef.current) return;

    const container = confettiRef.current;
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ec4899', '#f97316'];

    const createConfetti = () => {
      for (let i = 0; i < 60; i++) {
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
        }, i * 50);
      }
    };

    createConfetti();
    const interval = setInterval(createConfetti, 5000);

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

        <main className="relative z-20 flex flex-col items-center max-w-2xl w-full">
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-50 scale-150" />
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg relative z-10 float-slow">
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 text-center tracking-tight mb-4 uppercase">
            Stage {(nextStage ?? 2) - 1} Clear
          </h1>

          <p className="text-gray-500 text-lg lg:text-xl text-center max-w-lg mb-10">
            You found the hidden buttons and unlocked the pathway to the next layer.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-12">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
              <span className="text-gray-400 uppercase text-[10px] tracking-widest font-bold mb-2">Rank</span>
              <span className="text-2xl font-bold text-gray-900">A+</span>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
              <span className="text-gray-400 uppercase text-[10px] tracking-widest font-bold mb-2">Found</span>
              <span className="text-2xl font-bold text-gray-900">✓</span>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
              <span className="text-gray-400 uppercase text-[10px] tracking-widest font-bold mb-2">Next</span>
              <span className="text-2xl font-bold text-gray-900">S{nextStage}</span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="button-3d btn-green w-full max-w-sm h-16 flex items-center justify-center gap-3 text-white font-bold text-xl rounded-2xl group"
          >
            <span>Enter Stage {nextStage}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

        <main className="relative z-20 flex flex-col items-center max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Home className="w-10 h-10 text-gray-400" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Stage Reset
          </h1>

          <p className="text-gray-500 mb-8">
            Another player found the last button. Everyone returns to Stage 1.
          </p>

          <button
            onClick={onContinue}
            className="button-3d btn-blue w-full h-14 flex items-center justify-center gap-2 text-white font-bold text-lg rounded-2xl"
          >
            <RefreshCw className="w-5 h-5" />
            Back to Stage 1
          </button>
        </main>
      </div>
    );
  }

  // Game Clear - Victory!
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white overflow-hidden">
      <div className="grain fixed inset-0 z-10" />
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-20" />

      <main className="relative z-30 flex flex-col items-center text-center px-6 max-w-2xl w-full">
        {/* Trophy */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150" />
          <div className="trophy-bounce">
            <Trophy className="w-24 h-24 md:w-32 md:h-32 text-yellow-400 drop-shadow-2xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-4 uppercase">
          Champion!
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium mb-12">
          You have conquered the Ultimate Button Quest.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-16">
          <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stages</span>
            <span className="text-3xl font-bold text-gray-900">8 / 8</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Luck Score</span>
            <span className="text-3xl font-bold text-green-500">+100</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex flex-col items-center col-span-2 md:col-span-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Percentile</span>
            <span className="text-3xl font-bold text-gray-900">Top 1%</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Button Quest Champion!',
                  text: 'I conquered all stages of Button Quest!',
                  url: window.location.href
                }).catch(() => {});
              }
            }}
            className="button-3d btn-black px-12 py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Victory
          </button>
          <button
            onClick={onContinue}
            className="button-3d btn-green px-12 py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </main>
    </div>
  );
}
