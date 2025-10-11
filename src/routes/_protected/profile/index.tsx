import { createFileRoute, redirect } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProfileCard from "@/modules/profile/components/profile-card";
import { profileQueryOptions } from "@/modules/profile/service";
import { Route as ProfileRoute } from "../route";

export const Route = createFileRoute("/_protected/profile/")({
	loader: async ({ context }) => {
		const profileResponse = await context.queryClient.ensureQueryData(
			profileQueryOptions(),
		);

		if (!profileResponse.profile) {
			throw redirect({ to: "/profile/setup" });
		}

		return profileResponse.profile;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const user = ProfileRoute.useLoaderData();
	const profile = Route.useLoaderData();

	return (
		<div className="bg-background py-12 px-4">
			<div className="max-w-md mx-auto space-y-8">
				{/* Profile Card */}
				<ProfileCard session={user} profile={profile} />

				{/* Top Artists Section */}
				<div>
					<h2 className="text-lg font-semibold tracking-tight mb-4">
						Top 5 Artists
					</h2>
					<Card className="p-6 border">
						<p className="text-sm text-muted-foreground text-center py-8">
							Artists list coming soon
						</p>
					</Card>
				</div>

				{/* Top Albums Section */}
				<div>
					<h2 className="text-lg font-semibold tracking-tight mb-4">
						Top 5 Albums
					</h2>
					<Card className="p-6 border">
						<p className="text-sm text-muted-foreground text-center py-8">
							Albums list coming soon
						</p>
					</Card>
				</div>
			</div>
		</div>
	);
}
