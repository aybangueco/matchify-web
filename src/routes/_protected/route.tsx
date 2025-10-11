import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected")({
	loader: async () => {
		const { data } = await authClient.getSession();

		if (!data?.session) {
			throw redirect({ to: "/login" });
		}

		return data;
	},
	component: ProtectedLayout,
});

function ProtectedLayout() {
	return (
		<div className="relative">
			<header className="fixed w-full p-3 top-0 bg-secondary">
				<div>
					<h1 className="text-3xl font-bold">Matchify</h1>
				</div>
				<nav></nav>
			</header>
			<section className="pt-16 p-3">
				<Outlet />
			</section>
		</div>
	);
}
