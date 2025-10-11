import z from "zod";
import type { Pronoun } from "@/lib/types";

export const Pronouns: Pronoun[] = ["He/His", "She/Her"] as const;

export const profileSchema = z.object({
	avatarLink: z.string(),
	location: z
		.string()
		.nonempty({ error: "Location is required" })
		.min(3, { error: "Location too short" })
		.max(30, { error: "Location too long" }),
	bio: z
		.string()
		.nonempty({ error: "Bio is required" })
		.max(100, { error: "Bio too long" }),
	pronoun: z.enum(Pronouns).nonoptional({ error: "Pronoun is required" }),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
