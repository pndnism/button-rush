// ボタンの状態
export interface ButtonState {
  index: number;
  isCorrect: boolean;
  isPressed: boolean;
  pressedBy?: string;
  pressedAt?: number;
}

// ステージ状態
export interface StageState {
  stageId: number;
  totalButtons: number;
  correctButtons: number[];     // 正解ボタンのインデックス
  pressedButtons: {             // 押されたボタン
    [index: number]: {
      isCorrect: boolean;
      pressedBy: string;        // user token
      pressedAt: number;        // timestamp
    };
  };
  remainingCorrect: number;     // 残り正解数
  createdAt: number;
}

// ユーザー状態
export interface UserState {
  token: string;
  currentStage: number;
  remainingPresses: number;     // 残り押下可能回数
  usedFreePress: boolean;       // 無料押下を使ったか（各ステージで1回）
}

// ステージ設定
export interface StageConfig {
  stageId: number;
  buttonCount: number;
  correctCount: number;
  gridCols: number;
}

// ゲームイベント
export type GameEvent =
  | { type: 'BUTTON_PRESSED'; payload: { index: number; isCorrect: boolean; pressedBy: string } }
  | { type: 'STAGE_CLEARED'; payload: { clearedBy: string; nextStage: number } }
  | { type: 'STAGE_RESET'; payload: { reason: string } };

// ボタン押下結果
export interface PressResult {
  success: boolean;
  isCorrect: boolean;
  remainingCorrect: number;
  stageCleared: boolean;
  needsAd: boolean;
  message: string;
}
