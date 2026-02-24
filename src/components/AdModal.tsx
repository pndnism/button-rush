'use client';

import { useState, useEffect } from 'react';

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function AdModal({ isOpen, onComplete, onClose }: AdModalProps) {
  const [countdown, setCountdown] = useState(3);
  const [adWatched, setAdWatched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setAdWatched(false);
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setAdWatched(true);
    }
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleComplete = () => {
    if (adWatched) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-white">
        <h3 className="text-xl font-bold mb-4 text-center">📺 広告視聴</h3>

        <div className="bg-gray-700 rounded-lg p-8 mb-4 text-center">
          {!adWatched ? (
            <>
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-300 mb-2">広告を読み込み中...</p>
              <p className="text-2xl font-bold text-yellow-400">{countdown}秒</p>
              <p className="text-sm text-gray-400 mt-2">（開発用モック広告）</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">✅</div>
              <p className="text-green-400 font-bold">広告視聴完了！</p>
              <p className="text-gray-300 mt-2">+3回の押下権を獲得しました</p>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-lg font-bold transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleComplete}
            disabled={!adWatched}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors ${
              adWatched
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {adWatched ? '受け取る' : '視聴中...'}
          </button>
        </div>
      </div>
    </div>
  );
}
