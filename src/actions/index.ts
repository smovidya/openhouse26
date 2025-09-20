import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  random: defineAction({
    input: z.object({
      seed: z.number().optional(),
    }),
    handler(input, context) {
      const seed = input.seed ? parseInt(input.seed) : undefined;
      return { number: Math.random() + (seed || 0) };
    },
  }),
};
