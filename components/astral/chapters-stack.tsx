"use client";

import { CardStack } from "@/components/ui/card-stack";
import { stackCards } from "@/lib/astral-content";

export function ChaptersStack() {
  return (
    <CardStack
      items={stackCards}
      initialIndex={0}
      autoAdvance
      intervalMs={3200}
      pauseOnHover
      showDots
      cardWidth={480}
      cardHeight={300}
      maxVisible={5}
    />
  );
}
