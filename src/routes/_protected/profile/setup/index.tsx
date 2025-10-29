import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { UserCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Metadata from "@/components/page/metadata";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type ProfileSchema, Pronouns, profileSchema } from "@/modules/profile";
import {
	profileQueryOptions,
	useCreateProfileMutation,
} from "@/modules/profile/service";

export const Route = createFileRoute("/_protected/profile/setup/")({
	loader: async ({ context }) => {
		const profileResponse = await context.queryClient.ensureQueryData(
			profileQueryOptions(),
		);

		if (profileResponse.profile?.id) {
			throw redirect({ to: "/profile" });
		}
	},
	component: ProfileSetupPage,
});

function ProfileSetupPage() {
	return (
		<div className="flex min-h-screen justify-center items-center">
			<Metadata
				title="Profile Setup | Matchify"
				description="Setup your matchify profile"
			/>
			<div>
				<div className="text-center mb-10">
					<h1 className="font-bold text-2xl">Complete your profile</h1>
					<p>Let&apos;s setup your profile before we proceed.</p>
				</div>

				<ProfileSetupForm />
			</div>
		</div>
	);
}

function ProfileSetupForm() {
	const queryClient = useQueryClient();
	const createProfile = useCreateProfileMutation();
	const router = useRouter();

	const profileForm = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			avatarLink: "",
			pronoun: "He/His",
			bio: "",
			location: "",
		},
	});

	async function onSubmit(values: ProfileSchema) {
		createProfile.mutate(values, {
			onSuccess: async (data) => {
				toast.success(data.message);
				await queryClient.refetchQueries({ queryKey: ["profile"] });
				await router.invalidate();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	}

	return (
		<Form {...profileForm}>
			<form
				onSubmit={profileForm.handleSubmit(onSubmit)}
				className="border-2 p-10 rounded-md min-w-md"
			>
				<div className="flex items-center gap-3">
					<UserCircleIcon size={50} />
					<FormField
						control={profileForm.control}
						name="avatarLink"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Profile Picture</FormLabel>
								<FormControl>
									<Input type="file" {...field} />
								</FormControl>
								<FormDescription>PNG, JPG, GIF up to 10mb</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="mt-5 mb-5 space-y-4">
					<FormField
						control={profileForm.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location</FormLabel>
								<FormControl>
									<Input type="text" placeholder="City, State" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={profileForm.control}
						name="bio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Textarea
										className="max-h-28"
										placeholder="Write something about yourself..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={profileForm.control}
						name="pronoun"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pronoun</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select pronoun" />
										</SelectTrigger>
										<SelectContent>
											{Pronouns.map((p) => (
												<SelectItem key={p} value={p}>
													{p}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button
					disabled={profileForm.formState.isSubmitting}
					className="w-full"
					type="submit"
				>
					Save and Continue
				</Button>
			</form>
		</Form>
	);
}
