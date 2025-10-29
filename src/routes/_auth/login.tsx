import { createFileRoute } from "@tanstack/react-router";
import Metadata from "@/components/page/metadata";
import LoginForm from "@/modules/auth/components/login-form";

export const Route = createFileRoute("/_auth/login")({
	component: LoginPage,
});

export function LoginPage() {
	return (
		<div className="h-full flex justify-center items-center">
			<Metadata
				title="Login | Matchify"
				description="Login to your matchify account"
			/>

			<LoginForm />
		</div>
	);
}
