import { queryOptions, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
	ArtistResponse,
	ArtistsSearchResponse,
	GetArtistsResponse,
} from "@/lib/types";
import type { ArtistSchema } from "./schemas";

export function searchArtistQueryOptions(artistName: string) {
	return queryOptions({
		queryKey: ["artist-search", artistName],
		queryFn: () =>
			api<ArtistsSearchResponse>({
				method: "GET",
				url: `/artist/search?artist_name=${artistName}`,
			}),
	});
}

export function artistsQueryOptions(userID: string) {
	return queryOptions({
		queryKey: ["artists", userID],
		queryFn: () =>
			api<GetArtistsResponse>({ method: "GET", url: `/artist/${userID}` }),
	});
}

export function useCreateArtistMutation() {
	return useMutation({
		mutationKey: ["create-artist"],
		mutationFn: (data: ArtistSchema) =>
			api<ArtistResponse>({ method: "POST", url: "/artist", data }),
	});
}

export function useDeleteArtistMutation() {
	return useMutation({
		mutationKey: ["delete-artist"],
		mutationFn: (artistID: string) =>
			api({ method: "DELETE", url: `/artist/${artistID}` }),
	});
}
