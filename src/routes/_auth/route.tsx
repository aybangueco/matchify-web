import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context }) => {
		let redirectToProtected = false;

		const data = await context.auth.ensureSession();

		if (data) {
			redirectToProtected = true;
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
