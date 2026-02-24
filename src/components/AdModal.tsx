'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function AdModal({ isOpen, onComplete, onClose }: AdModalProps) {
  const [countdown, setCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [adWatched, setAdWatched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setIsLoading(false);
      setAdWatched(false);
      return;
    }

    // 自動的に広告開始
    setIsLoading(true);
    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setIsLoading(false);
        setAdWatched(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-sm p-8 rounded-[32px] shadow-2xl border border-gray-100 flex flex-col items-center text-center">
        {isLoading ? (
          <>
            <Loader2 className="w-12 h-12 text-gray-300 animate-spin mb-4" />
            <span className="text-4xl font-black text-gray-900">{countdown}</span>
          </>
        ) : adWatched ? (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-3xl">✓</span>
            </div>
            <button
              onClick={onComplete}
              className="button-3d btn-green w-full py-4 rounded-2xl font-bold text-white text-lg"
            >
              +3
            </button>
          </>
        ) : null}

        {!adWatched && (
          <button
            onClick={onClose}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600"
          >
            skip
          </button>
        )}
      </div>
    </div>
  );
}
