export const REEL_START = 10;
export const REEL_COUNT = 96;

export function reelSrc(index: number) {
  const n = Math.max(0, Math.min(REEL_COUNT - 1, index));
  return `/astral/flow/reel/${String(n + REEL_START).padStart(4, "0")}.jpg`;
}
