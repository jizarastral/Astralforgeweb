export const GLOW_COUNT = 121;

export function glowSrc(index: number) {
  const n = ((index % GLOW_COUNT) + GLOW_COUNT) % GLOW_COUNT;
  return `/astral/flow/glow/${String(n).padStart(4, "0")}.jpg`;
}
