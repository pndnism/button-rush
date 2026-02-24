import { StageConfig, StageState } from '@/types';

// ステージごとのボタン数設定
const BUTTON_COUNTS = [2, 4, 9, 25, 49, 64, 81, 100];
const CORRECT_RATIO = 0.3;
const MAX_STAGE = BUTTON_COUNTS.length;

/**
 * ステージ設定を取得
 */
export function getStageConfig(stageId: number): StageConfig {
  const clampedStage = Math.min(Math.max(1, stageId), MAX_STAGE);
  const buttonCount = BUTTON_COUNTS[clampedStage - 1];
  const correctCount = Math.max(1, Math.ceil(buttonCount * CORRECT_RATIO));

  // グリッドの列数を計算（正方形に近い形）
  const gridCols = Math.ceil(Math.sqrt(buttonCount));

  return {
    stageId: clampedStage,
    buttonCount,
    correctCount,
    gridCols,
  };
}

/**
 * 正解ボタンをランダムに選択
 */
function selectCorrectButtons(totalButtons: number, correctCount: number): number[] {
  const indices = Array.from({ length: totalButtons }, (_, i) => i);
  const correct: number[] = [];

  for (let i = 0; i < correctCount; i++) {
    const randomIndex = Math.floor(Math.random() * indices.length);
    correct.push(indices[randomIndex]);
    indices.splice(randomIndex, 1);
  }

  return correct.sort((a, b) => a - b);
}

/**
 * 新しいステージ状態を生成
 */
export function createStageState(stageId: number): StageState {
  const config = getStageConfig(stageId);
  const correctButtons = selectCorrectButtons(config.buttonCount, config.correctCount);

  return {
    stageId: config.stageId,
    totalButtons: config.buttonCount,
    correctButtons,
    pressedButtons: {},
    remainingCorrect: config.correctCount,
    createdAt: Date.now(),
  };
}

/**
 * ボタンが正解かどうかを判定
 */
export function isCorrectButton(state: StageState, buttonIndex: number): boolean {
  return state.correctButtons.includes(buttonIndex);
}

/**
 * ボタンが既に押されているかどうかを判定
 */
export function isButtonPressed(state: StageState, buttonIndex: number): boolean {
  return buttonIndex in state.pressedButtons;
}

/**
 * ステージがクリアされたかどうかを判定
 */
export function isStageCleared(state: StageState): boolean {
  return state.remainingCorrect <= 0;
}

/**
 * 最大ステージ数を取得
 */
export function getMaxStage(): number {
  return MAX_STAGE;
}

/**
 * ゲームクリア判定
 */
export function isGameComplete(stageId: number): boolean {
  return stageId > MAX_STAGE;
}
