import { createFileRoute } from "@tanstack/react-router";
import Metadata from "@/components/page/metadata";
import { RegisterForm } from "@/modules/auth";

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
