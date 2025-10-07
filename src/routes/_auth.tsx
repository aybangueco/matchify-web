import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<section className="h-screen p-3">
			<Outlet />
		</section>
	);
}
