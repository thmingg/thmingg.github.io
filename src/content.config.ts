import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";
export const PROJECTS_PATH = "src/content/projects";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

const projects = defineCollection({
  // Only project entry files at the collection root (not nested docs under images/)
  loader: glob({ pattern: "[^_]*.{md,mdx}", base: `./${PROJECTS_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      company: z.string(),
      role: z.string(),
      period: z.string(),
      stack: z.array(z.string()),
      featured: z.boolean().optional(),
      order: z.number().optional(),
      repo: z.string().optional(),
      demo: z.string().optional(),
      /** Cover image — co-locate under src/content/projects/images/ */
      heroImage: image().optional(),
      /** YouTube, Vimeo, or absolute http(s) video URL shown on the detail page */
      videoUrl: z
        .string()
        .refine(
          value => {
            try {
              const parsed = new URL(value);
              return parsed.protocol === "http:" || parsed.protocol === "https:";
            } catch {
              return false;
            }
          },
          { message: "videoUrl must be an absolute http(s) URL" }
        )
        .optional(),
      /** Extra screenshots shown in a gallery below the write-up */
      gallery: z.array(image()).optional(),
    }),
});

export const collections = { posts, pages, projects };
