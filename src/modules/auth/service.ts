import { queryOptions } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Session } from "@/lib/auth-client";

export function sessionQueryOptions() {
	return queryOptions({
		queryKey: ["session"],
		queryFn: () =>
			api<Session>({ method: "GET", url: "/api/auth/get-session" }),
	});
}
