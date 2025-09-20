import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  random: defineAction({
    handler(input, context) {
      return { number: Math.random() };
    },
  }),
};
