import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { AuthenticatedResponse } from "@/lib/types";
import type { LoginSchema, RegisterSchema } from "./schema";

export function useLoginMutation() {
	return useMutation({
		mutationKey: ["login"],
		mutationFn: (data: LoginSchema) => {
			return api<AuthenticatedResponse>({
				method: "POST",
				url: "/auth/login",
				data,
			});
		},
	});
}

export function useRegisterMutation() {
	return useMutation({
		mutationKey: ["register"],
		mutationFn: (data: RegisterSchema) => {
			return api<AuthenticatedResponse>({
				method: "POST",
				url: "/auth/register",
				data,
			});
		},
	});
}
