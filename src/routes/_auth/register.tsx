import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Metadata from "@/components/page/metadata";
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
import { type RegisterSchema, registerSchema } from "@/modules/auth";

export const Route = createFileRoute("/_auth/register")({
	component: RegisterPage,
});

function RegisterPage() {
	return (
		<div className="h-full flex flex-col justify-center items-center">
			<Metadata
				title="Register | Matchify"
				description="Register for a Matchify account"
			/>

			<RegisterForm />
		</div>
	);
}

function RegisterForm() {
	const registerForm = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
	});

	const navigate = useNavigate();

	async function onSubmit(values: RegisterSchema) {
		const { error } = await authClient.signUp.email(values);

		if (error?.message) {
			toast.error(error.message);
			return;
		}

		toast.success("Registered successfully");
		navigate({ to: "/profile/setup" });
	}

	return (
		<Form {...registerForm}>
			<form
				onSubmit={registerForm.handleSubmit(onSubmit)}
				className="w-md max-w-md flex flex-col gap-3"
			>
				<h1 className="text-center text-xl font-bold">Register</h1>
				<FormField
					control={registerForm.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter your name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={registerForm.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Enter your email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={registerForm.control}
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
				<div className="flex gap-3">
					<FormField
						control={registerForm.control}
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

					<FormField
						control={registerForm.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
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
				</div>
				<Button disabled={registerForm.formState.isSubmitting} type="submit">
					{registerForm.formState.isSubmitting ? "Submitting..." : "Submit"}
				</Button>
				<p className="text-center">
					Already have account?{" "}
					<span>
						<Link
							disabled={registerForm.formState.isSubmitting}
							className="hover:underline"
							to="/login"
						>
							Login
						</Link>{" "}
						here.
					</span>
				</p>
			</form>
		</Form>
	);
}
