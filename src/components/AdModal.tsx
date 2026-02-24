'use client';

import { useState, useEffect } from 'react';
import { Video, Loader2, ExternalLink } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function AdModal({ isOpen, onComplete, onClose }: AdModalProps) {
  const [countdown, setCountdown] = useState(3);
  const [adWatched, setAdWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setAdWatched(false);
      setIsLoading(false);
      return;
    }
  }, [isOpen]);

  const handleWatchAd = () => {
    setIsLoading(true);

    // Simulate ad countdown
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
  };

  const handleComplete = () => {
    if (adWatched) {
      onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md p-8 rounded-[32px] shadow-2xl border border-gray-100 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : adWatched ? (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
          ) : (
            <Video className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {adWatched ? 'Ad Complete!' : 'No More Free Taps'}
        </h3>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          {adWatched ? (
            <>You earned <span className="font-bold text-black">3 extra attempts</span>!</>
          ) : isLoading ? (
            <>Loading ad... <span className="font-bold text-black">{countdown}s</span></>
          ) : (
            <>Watch a short ad to earn <span className="font-bold text-black">3 extra attempts</span> and keep playing!</>
          )}
        </p>

        {/* Buttons */}
        {!adWatched && !isLoading && (
          <button
            onClick={handleWatchAd}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Watch Ad to Continue
            <ExternalLink className="w-4 h-4" />
          </button>
        )}

        {adWatched && (
          <button
            onClick={handleComplete}
            className="w-full button-3d btn-green py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
          >
            Continue Playing
          </button>
        )}

        {/* Cancel link */}
        {!adWatched && (
          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium underline underline-offset-4 transition-colors"
          >
            Maybe later
          </button>
        )}

        {/* Dev note */}
        {isLoading && (
          <p className="mt-4 text-[10px] text-gray-300 uppercase tracking-widest">
            Development mock ad
          </p>
        )}
      </div>
    </div>
  );
}
