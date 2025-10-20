import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import type { ArtistMatchInfo } from "@/lib/types";
import {
	ArtistCard,
	type ArtistSchema,
	artistsQueryOptions,
	searchArtistQueryOptions,
	useCreateArtistMutation,
	useDeleteArtistMutation,
} from "@/modules/artist";
import { useAuth } from "@/modules/auth/components/auth-provider";
import { ProfileCard, profileQueryOptions } from "@/modules/profile";

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
	component: ProfilePage,
});

function ProfilePage() {
	const { session } = useAuth();
	const profile = Route.useLoaderData();

	const queryClient = useQueryClient();
	const artistsQuery = useQuery(artistsQueryOptions(session?.user.id ?? ""));

	const [artistActive, setArtistActive] = useState<boolean>(false);

	const deleteArtistMutation = useDeleteArtistMutation();

	const onClickDeleteArtist = (artistID: string) => {
		return deleteArtistMutation.mutate(artistID, {
			onSuccess: () => {
				toast.success("Deleted successfully");
				queryClient.invalidateQueries({ queryKey: ["artists"] });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	return (
		<div className="py-12 px-4">
			<div className="max-w-md mx-auto space-y-8">
				{/* Profile Card */}
				<ProfileCard profile={profile} />

				{/* Top Artists Section */}
				<div>
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-semibold tracking-tight mb-4">
							Top 5 Artists
						</h2>
						<SearchArtistDialog
							open={artistActive}
							onOpenChange={(e) => setArtistActive(e)}
						/>
					</div>
					<Card className="p-6 border">
						{artistsQuery.data && artistsQuery.data?.artists.length > 0 ? (
							artistsQuery.data?.artists.map((a) => (
								<ArtistCard
									key={a.id}
									artistName={a.artistName}
									onClickDelete={() => onClickDeleteArtist(a.id)}
								/>
							))
						) : (
							<p className="text-sm text-muted-foreground text-center py-8">
								Empty list
							</p>
						)}
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

function SearchArtistDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (active: boolean) => void;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [artists, setArtists] = useState<ArtistMatchInfo[]>([]);
	const { session } = useAuth();

	let searchResult = "";

	if (!searchQuery) {
		searchResult = "Type to search for an artist";
	} else if (isSearching) {
		searchResult = "Searching...";
	} else if (searchQuery && artists.length < 1) {
		searchResult = "Artist not found";
	}

	const debounce = useDebounce();
	const queryClient = useQueryClient();

	const createArtistMutation = useCreateArtistMutation();

	const onClickAddArtist = (values: ArtistSchema) => {
		return createArtistMutation.mutate(values, {
			onSuccess: () => {
				toast.success(`${values.artistName} added successfully`);
				onOpenChange(false);
				setSearchQuery("");
				setArtists([]);
				queryClient.invalidateQueries({ queryKey: ["artists"] });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Artist</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Search Input */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search artists..."
							value={searchQuery}
							onChange={(e) => {
								const value = e.target.value;
								setSearchQuery(value);
								setIsSearching(true);
								debounce(() => {
									queryClient
										.ensureQueryData(searchArtistQueryOptions(value))
										.then((data) => {
											setArtists(data.artists ?? []);
										})
										.finally(() => setIsSearching(false));
								}, 500);
							}}
							className="pl-10"
							autoFocus
						/>
					</div>

					{/* Artists List */}
					<div className="space-y-2 max-h-[300px] overflow-y-auto">
						{artists.length > 0 ? (
							artists.map((artist) => (
								<button
									type="button"
									key={artist.url}
									onClick={() =>
										onClickAddArtist({
											artistName: artist.name,
											createdBy: session?.user.id ?? "",
										})
									}
									className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex justify-between items-center group"
								>
									<div>
										<p className="font-medium text-sm">{artist.name}</p>
									</div>
									<Plus className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
								</button>
							))
						) : (
							<p className="text-sm text-muted-foreground text-center py-8">
								{searchResult}
							</p>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
