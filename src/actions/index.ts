import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  random: defineAction({
    input: z.object({
      seed: z.number().optional(),
    }),
    handler(input, _context) {
      const seed = input.seed ? input.seed : undefined;
      return { number: Math.random() + (seed || 0) };
    },
  }),
};
