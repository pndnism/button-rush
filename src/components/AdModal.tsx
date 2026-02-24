'use client';

import { useState, useEffect } from 'react';
import { Loader2, Play } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function AdModal({ isOpen, onComplete, onClose }: AdModalProps) {
  const [phase, setPhase] = useState<'confirm' | 'watching' | 'done'>('confirm');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) {
      setPhase('confirm');
      setCountdown(3);
    }
  }, [isOpen]);

  const handleStartAd = () => {
    setPhase('watching');
    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setPhase('done');
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-sm p-8 rounded-[32px] shadow-2xl border border-gray-100 flex flex-col items-center text-center">
        {phase === 'confirm' && (
          <>
            <p className="text-gray-600 mb-6">
              Watch a short ad to get<br />
              <span className="text-2xl font-black text-gray-900">1 more tap</span>
            </p>
            <button
              onClick={handleStartAd}
              className="button-3d btn-green w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Watch Ad
            </button>
            <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600"
            >
              cancel
            </button>
          </>
        )}

        {phase === 'watching' && (
          <>
            <Loader2 className="w-12 h-12 text-gray-300 animate-spin mb-4" />
            <span className="text-4xl font-black text-gray-900">{countdown}</span>
          </>
        )}

        {phase === 'done' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-3xl">✓</span>
            </div>
            <button
              onClick={onComplete}
              className="button-3d btn-green w-full py-4 rounded-2xl font-bold text-white text-lg"
            >
              +1 tap
            </button>
          </>
        )}
      </div>
    </div>
  );
}
