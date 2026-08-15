export const REEL_START = 16;
export const REEL_COUNT = 90;

export function reelSrc(index: number) {
  const n = Math.max(0, Math.min(REEL_COUNT - 1, index));
  return `/astral/flow/reel/${String(n + REEL_START).padStart(4, "0")}.jpg`;
}
