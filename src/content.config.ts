import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: file("src/data/work.json"),
  schema: z.object({
    brand: z.string().min(1),
    type: z.enum(["influencer", "ugc"]),
    industry: z.enum(["Travel", "Lifestyle", "Fashion", "Tech & gear"]),
    format: z.string().min(1),
    result: z.string().min(1),
    video: z.string(), // M14: change to z.url() once videos are on R2
    poster: z.string(), // M14: change to z.url() once videos are on R2
    platformUrl: z.url().or(z.literal("")),
  }),
});

// By default file() creates entries from a single file that contains an array of objects with a unique `id` field.

// testimonials collection
const testimonials = defineCollection({
  loader: file("src/data/testimonials.json"),
  schema: z.object({
    text: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    offer: z.enum(["Influencer collab", "UGC content"]),
    permission: z.boolean(),
  }),
});

export const socialLink = z.object({
  handle: z.string().startsWith("@"),
  url: z.url(),
});

// Single-object files: wrap in a one-item array with an id,
// so file() loads them as one entry instead of one per key.

// socials collection
const socials = defineCollection({
  loader: file("src/data/socials.json", {
    parser: (text) => [{ id: "socials", ...JSON.parse(text) }],
  }),
  schema: z.object({
    instagram: socialLink,
    tiktok: socialLink,
    email: z.email(),
  }),
});

// form collection
const form = defineCollection({
  loader: file("src/data/form.json", {
    parser: (text) => [{ id: "form", ...JSON.parse(text) }],
  }),
  schema: z.object({
    needs: z.array(
      z.object({
        value: z.enum(["influencer", "ugc", "both"]),
        label: z.string().min(1),
      }),
    ),
    budgets: z.array(z.string().min(1)),
    mediaKitLabel: z.string().min(1),
    messages: z.object({
      sending: z.string().min(1),
      sent: z.string().min(1),
      emailInvalid: z.string().min(1),
    }),
  }),
});

export const offer = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  items: z.array(z.string().min(1)),
});

// services collection
const services = defineCollection({
  loader: file("src/data/services.json", {
    parser: (text) => [{ id: "services", ...JSON.parse(text) }],
  }),
  schema: z.object({
    influencer: offer,
    ugc: offer,
    process: z.array(
      z.object({
        step: z.enum(["Brief", "Create", "Deliver"]),
        text: z.string().min(1),
      }),
    ),
    note: z.string().min(1),
  }),
});

// null = Cheska hasn't supplied this number yet. Never replace with an estimate.

export const reachStat = z.object({
  value: z.number().nullable(),
  unit: z.enum(["M", "K", ""]),
  label: z.string().min(1),
  placeholder: z.string().optional(),
});

const platformStats = z.object({
  followers: z.number().int().nonnegative(),
  avgViews: z.number().int().nullable(),
  engagementRate: z.number().min(0).max(100).nullable(),
});

export const bar = z.object({
  label: z.string().min(1),
  pct: z.number().min(0).max(100),
});

// stats collection
const stats = defineCollection({
  loader: file("src/data/stats.json", {
    parser: (text) => [{ id: "stats", ...JSON.parse(text) }],
  }),
  schema: z.object({
    asOf: z.string().min(1),
    source: z.string().min(1),
    reach: z.array(reachStat),
    tiktok: platformStats.extend({
      likes: z.string().min(1),
      topVideoViews: z.string().min(1),
    }),
    instagram: platformStats.extend({
      posts: z.number().int().nonnegative(),
    }),
    audience: z.object({
      isSample: z.boolean(),
      note: z.string().min(1),
      age: z.array(bar),
      gender: z.object({
        women: z.number().min(0).max(100),
        men: z.number().min(0).max(100),
      }),
      countries: z.array(bar),
      topCities: z.array(z.string().min(1)),
    }),
  }),
});

export const collections = {
  work,
  testimonials,
  socials,
  form,
  services,
  stats,
};
