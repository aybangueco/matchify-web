import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context }) => {
		let redirectToProtected = false;

		try {
			await context.auth.ensureSession();
			redirectToProtected = true;
		} catch (_) {
			redirectToProtected = false;
		}

		if (redirectToProtected) {
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
