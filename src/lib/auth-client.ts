import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http://localhost:8080",
	plugins: [usernameClient()],
	fetchOptions: {
		credentials: "include",
	},
});
