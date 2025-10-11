import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async () => {
		const { data } = await authClient.getSession();

		if (data?.session) {
			throw redirect({ to: "/profile" });
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<section className="h-screen p-3">
			<Outlet />
		</section>
	);
}
