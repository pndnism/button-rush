'use client';

import { ButtonState } from '@/types';

interface ButtonProps {
  state: ButtonState;
  disabled: boolean;
  onPress: (index: number) => void;
}

export default function Button({ state, disabled, onPress }: ButtonProps) {
  const getButtonStyle = () => {
    if (!state.isPressed) {
      // 未押下：青いボタン
      return 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg hover:shadow-xl';
    }
    if (state.isCorrect) {
      // 正解：緑
      return 'bg-green-500 text-white cursor-not-allowed';
    }
    // 不正解：赤
    return 'bg-red-500 text-white cursor-not-allowed';
  };

  const handleClick = () => {
    if (!state.isPressed && !disabled) {
      onPress(state.index);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state.isPressed || disabled}
      className={`
        w-full aspect-square rounded-lg font-bold text-lg
        transition-all duration-200 transform
        ${getButtonStyle()}
        ${!state.isPressed && !disabled ? 'hover:scale-105 active:scale-95' : ''}
        ${disabled && !state.isPressed ? 'opacity-50 cursor-not-allowed' : ''}
        flex items-center justify-center
        min-h-[40px] min-w-[40px]
      `}
    >
      {state.isPressed ? (state.isCorrect ? '○' : '×') : '?'}
    </button>
  );
}
