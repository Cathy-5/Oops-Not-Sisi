export const STARTING_LIVES = 3;
export const STARTING_SISI_COUNT = 1;
export const STARTING_MOLE_COUNT = 3;
export const START_TIME = 30;
export const STREAK_GOAL = 3;
export const STREAK_TIME_BONUS = 3;
export const DEFAULT_PROTECTED_NAME = 'Sisi';

export function getTargetMoleCount(elapsedTime: number) {
  if (elapsedTime >= 60) return 5;
  if (elapsedTime >= 30) return 4;

  return STARTING_MOLE_COUNT;
}

export function getTargetSisiCount(elapsedTime: number, targetMoleCount: number) {
  const maxSisiCount = Math.max(targetMoleCount - 1, 1);
  let nextSisiCount = STARTING_SISI_COUNT;

  if (elapsedTime >= 60) {
    nextSisiCount = 3;
  } else if (elapsedTime >= 30) {
    nextSisiCount = 2;
  }

  // Sisi can become more dangerous, but should always be fewer than groundhogs
  return Math.min(nextSisiCount, maxSisiCount);
}

export function getSisiPhase(elapsedTime: number) {
  if (elapsedTime >= 120) return 'Disaster';
  if (elapsedTime >= 90) return 'Mixed';
  if (elapsedTime >= 60) return 'Masked';

  return 'Regular';
}

export function getSisiStatus(elapsedTime: number, sisiIndex: number) {
  const phase = getSisiPhase(elapsedTime);

  if (phase === 'Regular') return 'sisi';
  if (phase === 'Masked') return 'disguised-sisi';

  return sisiIndex % 2 === 0 ? 'disguised-sisi' : 'sisi';
}

export function canShowComboHole(elapsedTime: number) {
  return elapsedTime >= 90;
}

export function canShowDoubleSisi(elapsedTime: number) {
  return elapsedTime >= 120;
}

export function getBetterScore(currentScore: number, pastBestScore: number) {
  return Math.max(currentScore, pastBestScore);
}

export function getProtectedName(inputName: string | null | undefined) {
  const trimmedName = inputName?.trim();

  return trimmedName || DEFAULT_PROTECTED_NAME;
}
