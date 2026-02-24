import { UserState } from '@/types';

const USER_STORAGE_KEY = 'button-rush-user';
const AD_GRANT_PRESSES = 3;

/**
 * ユーザートークンを生成
 */
function generateToken(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 初期ユーザー状態を作成
 */
export function createInitialUserState(): UserState {
  return {
    token: generateToken(),
    currentStage: 1,
    remainingPresses: 0,
    usedFreePress: false,
  };
}

/**
 * ローカルストレージからユーザー状態を取得
 */
export function loadUserState(): UserState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserState;
    }
  } catch (error) {
    console.error('Failed to load user state:', error);
  }
  return null;
}

/**
 * ユーザー状態をローカルストレージに保存
 */
export function saveUserState(state: UserState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save user state:', error);
  }
}

/**
 * ユーザー状態を取得（なければ作成）
 */
export function getOrCreateUserState(): UserState {
  const existing = loadUserState();
  if (existing) return existing;

  const newState = createInitialUserState();
  saveUserState(newState);
  return newState;
}

/**
 * ボタンを押せるかどうかを判定
 */
export function canPressButton(user: UserState): boolean {
  // 無料押下がまだ使われていない場合はOK
  if (!user.usedFreePress) return true;
  // 残り押下回数がある場合はOK
  return user.remainingPresses > 0;
}

/**
 * ボタン押下後のユーザー状態を更新
 */
export function consumePress(user: UserState): UserState {
  if (!user.usedFreePress) {
    // 無料押下を使用
    return {
      ...user,
      usedFreePress: true,
    };
  }

  // 有料押下を消費
  return {
    ...user,
    remainingPresses: Math.max(0, user.remainingPresses - 1),
  };
}

/**
 * 広告視聴後に押下回数を付与
 */
export function grantPressesFromAd(user: UserState): UserState {
  return {
    ...user,
    remainingPresses: user.remainingPresses + AD_GRANT_PRESSES,
  };
}

/**
 * ステージ進行時のユーザー状態更新
 */
export function advanceToStage(user: UserState, nextStage: number): UserState {
  return {
    ...user,
    currentStage: nextStage,
    usedFreePress: false, // 新しいステージでは無料押下をリセット
  };
}

/**
 * ステージ1にリセット
 */
export function resetToStage1(user: UserState): UserState {
  return {
    ...user,
    currentStage: 1,
    usedFreePress: false,
  };
}
