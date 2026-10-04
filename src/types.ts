import type { z } from "astro/zod";
import type { socialLink, reachStat, offer, bar } from "./content.config";

export type Bar = z.infer<typeof bar>;
export type ReachStat = z.infer<typeof reachStat>;
export type Offer = z.infer<typeof offer>;
export type SocialLink = z.infer<typeof socialLink>;
