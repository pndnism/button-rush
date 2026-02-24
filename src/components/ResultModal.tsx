'use client';

interface ResultModalProps {
  isOpen: boolean;
  type: 'clear' | 'reset' | 'gameClear';
  nextStage?: number;
  onContinue: () => void;
}

export default function ResultModal({ isOpen, type, nextStage, onContinue }: ResultModalProps) {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'clear':
        return {
          icon: '🎉',
          title: 'ステージクリア！',
          message: `次はステージ ${nextStage} です`,
          buttonText: '次のステージへ',
          buttonClass: 'bg-green-500 hover:bg-green-600',
        };
      case 'reset':
        return {
          icon: '😢',
          title: 'ステージリセット',
          message: '他のプレイヤーがクリアしました。ステージ1からやり直しです。',
          buttonText: 'ステージ1へ',
          buttonClass: 'bg-blue-500 hover:bg-blue-600',
        };
      case 'gameClear':
        return {
          icon: '🏆',
          title: 'ゲームクリア！',
          message: 'おめでとうございます！全ステージをクリアしました！',
          buttonText: '最初から遊ぶ',
          buttonClass: 'bg-yellow-500 hover:bg-yellow-600',
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-white text-center">
        <div className="text-6xl mb-4">{content.icon}</div>
        <h3 className="text-2xl font-bold mb-2">{content.title}</h3>
        <p className="text-gray-300 mb-6">{content.message}</p>

        <button
          onClick={onContinue}
          className={`w-full px-6 py-3 rounded-lg font-bold text-white transition-colors ${content.buttonClass}`}
        >
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}
