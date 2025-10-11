import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Session } from "@/lib/auth-client";
import type { Profile } from "@/lib/types";

type ProfileCardProps = {
	session: Session;
	profile: Profile;
};

export default function ProfileCard({ session, profile }: ProfileCardProps) {
	return (
		<Card className="border shadow-sm p-8">
			<div className="flex flex-col items-center text-center space-y-4">
				<div className="rounded-full bg-muted p-3">
					<User size={80} className="text-muted-foreground" />
				</div>

				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						{session.user.name}
					</h1>

					<div>@{session.user.username}</div>

					<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<span>{profile.location}</span>
						<span className="text-xs">•</span>
						<span>{profile.pronoun}</span>
					</div>
				</div>

				<p className="text-sm leading-relaxed text-foreground/90 max-w-xs">
					{profile.bio}
				</p>

				<Button className="w-full mt-4" size="default">
					Edit Profile
				</Button>
			</div>
		</Card>
	);
}
