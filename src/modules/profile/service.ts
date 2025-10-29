import { queryOptions, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { GetProfileResponse, GetProfileUserResponse } from "@/lib/types";
import type { ProfileSchema } from "./schema";

export function profileQueryOptions() {
	return queryOptions({
		queryKey: ["profile"],
		queryFn: () =>
			api<GetProfileUserResponse>({ method: "GET", url: "/profile" }),
	});
}

export function userProfileByUsernameQueryOptions(username: string) {
	return queryOptions({
		queryKey: ["user-profile-username", username],
		queryFn: () =>
			api<GetProfileUserResponse>({
				method: "GET",
				url: `/profile/${username}`,
			}),
	});
}

export function useCreateProfileMutation() {
	return useMutation({
		mutationKey: ["create-profile"],
		mutationFn: (data: ProfileSchema) =>
			api<GetProfileResponse>({ method: "POST", url: "/profile", data }),
	});
}

export function useUpdateProfileMutation() {
	return useMutation({
		mutationKey: ["update-profile"],
		mutationFn: (data: ProfileSchema) =>
			api<GetProfileResponse>({ method: "PATCH", url: "/profile", data }),
	});
}
