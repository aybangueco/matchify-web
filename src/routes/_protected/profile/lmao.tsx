import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/profile/lmao")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_protected/profile/lmao"!</div>;
}
