import { queryOptions, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { GetProfileResponse } from "@/lib/types";
import type { ProfileSchema } from "./schema";

export function profileQueryOptions() {
	return queryOptions({
		queryKey: ["profile"],
		queryFn: () => api<GetProfileResponse>({ method: "GET", url: "/profile" }),
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
