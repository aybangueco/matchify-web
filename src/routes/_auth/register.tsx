import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
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
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: RegisterSchema) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
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
				<Button type="submit">Submit</Button>
				<p className="text-center">
					Already have account?{" "}
					<span>
						<Link className="hover:underline" to="/login">
							Login
						</Link>{" "}
						here.
					</span>
				</p>
			</form>
		</Form>
	);
}
