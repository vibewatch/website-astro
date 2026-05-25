import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const reports = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./docs",
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    date: z.string().optional(),
    hide: z.array(z.string()).optional(),
  }),
});

export const collections = { reports };
