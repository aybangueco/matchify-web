import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {
	type LoginSchema,
	loginSchema,
	sessionQueryOptions,
} from "@/modules/auth";

export default function LoginForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const loginForm = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginSchema) {
		await authClient.signIn.username(values, {
			onSuccess: async () => {
				toast.success("Logged in successfully");
				await queryClient.refetchQueries(sessionQueryOptions());
				await router.invalidate();
			},
			onError(ctx) {
				toast.error(ctx.error.message);
			},
		});
	}

	return (
		<Form {...loginForm}>
			<form
				onSubmit={loginForm.handleSubmit(onSubmit)}
				className="w-md max-w-md flex flex-col gap-3"
			>
				<h1 className="text-center text-xl font-bold">Login</h1>
				<FormField
					control={loginForm.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Enter your username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={loginForm.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Enter your password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="text-right">
					<p className="text-sm">Forgot your password?</p>
				</div>
				<Button disabled={loginForm.formState.isSubmitting} type="submit">
					{loginForm.formState.isSubmitting ? "Submitting..." : "Submit"}
				</Button>
				<p className="text-center">
					Don&apos;t have account yet?{" "}
					<span>
						<Link
							disabled={loginForm.formState.isSubmitting}
							className="hover:underline"
							to="/register"
						>
							Register
						</Link>{" "}
						here.
					</span>
				</p>
			</form>
		</Form>
	);
}
