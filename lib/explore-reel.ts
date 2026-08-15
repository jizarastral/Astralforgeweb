export const REEL_COUNT = 233;

export function reelSrc(index: number) {
  const n = Math.max(0, Math.min(REEL_COUNT - 1, index));
  return `/astral/flow/reel/${String(n).padStart(4, "0")}.jpg`;
}
