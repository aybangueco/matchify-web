import z from "zod";

export const artistSchema = z.object({
	artistName: z.string().nonempty({ error: "Artist name is required" }),
	createdBy: z.string().nonempty({ error: "Created by is required" }),
});

export type ArtistSchema = z.infer<typeof artistSchema>;
