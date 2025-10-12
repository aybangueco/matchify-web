import { createFileRoute, notFound } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { userProfileQueryOptions } from "@/modules/profile";
import ProfileCard from "@/modules/profile/components/profile-card";
import { Route as ProtectedRoute } from "../../route";

export const Route = createFileRoute("/_protected/profile/$userID/")({
	loader: async ({ params, context }) => {
		const profileResponse = await context.queryClient.ensureQueryData(
			userProfileQueryOptions(params.userID),
		);

		if (!profileResponse.profile) {
			throw notFound();
		}

		return profileResponse.profile;
	},
	component: ProfileUserPage,
});

function ProfileUserPage() {
	const data = ProtectedRoute.useLoaderData();
	const profile = Route.useLoaderData();

	return (
		<div className="py-12 px-4">
			<div className="max-w-md mx-auto space-y-8">
				{/* Profile Card */}
				<ProfileCard session={data} profile={profile} />

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
