'use client';

import { Check, X } from 'lucide-react';
import { ButtonState } from '@/types';

// Button colors and shapes
const COLORS = ['btn-red', 'btn-blue', 'btn-green', 'btn-yellow', 'btn-pink', 'btn-gray'];
const SHAPES = ['rounded-full', 'rounded-xl', 'rounded-lg'];

interface ButtonProps {
  state: ButtonState;
  disabled: boolean;
  onPress: (index: number) => void;
  colorIndex?: number;
  shapeIndex?: number;
}

export default function Button({ state, disabled, onPress, colorIndex, shapeIndex }: ButtonProps) {
  // Deterministic color/shape based on index
  const color = COLORS[colorIndex ?? state.index % COLORS.length];
  const shape = SHAPES[shapeIndex ?? state.index % SHAPES.length];

  const handleClick = () => {
    if (!state.isPressed && !disabled) {
      onPress(state.index);
    }
  };

  // Correct button
  if (state.isPressed && state.isCorrect) {
    return (
      <button
        disabled
        className={`
          button-3d btn-green pressed correct-pulse
          w-[68px] h-[68px] ${shape}
          flex items-center justify-center
          pointer-events-none
        `}
      >
        <Check className="w-6 h-6 text-white" strokeWidth={3} />
      </button>
    );
  }

  // Wrong / Taken button
  if (state.isPressed && !state.isCorrect) {
    return (
      <button
        disabled
        className={`
          button-3d btn-gray pressed
          w-[68px] h-[68px] ${shape}
          flex items-center justify-center
          opacity-40 grayscale pointer-events-none
        `}
      >
        <X className="w-5 h-5 text-white/60" />
      </button>
    );
  }

  // Active button (unpressed)
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        button-3d ${color}
        w-[68px] h-[68px] ${shape}
        flex items-center justify-center
        hover:scale-105 active:scale-95
        transition-transform
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span className="w-3 h-3 bg-white/20 rounded-full" />
    </button>
  );
}
