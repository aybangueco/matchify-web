import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Disc3, Film, type LucideProps, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_protected/find/")({
	component: FindPage,
});

type Option = {
	icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
	label: string;
	description: string;
	onClick?: () => void;
};

function FindPage() {
	const navigate = useNavigate();

	const options: Option[] = [
		{
			icon: Music,
			label: "Find Strangers Based on Artists",
			description: "Connect over your favorite musicians and artists",
			onClick: () => navigate({ to: "/find/artist" }),
		},
		{
			icon: Disc3,
			label: "Find Strangers Based on Albums",
			description: "Share your love for iconic albums",
		},
		{
			icon: Film,
			label: "Find Strangers Based on Movies",
			description: "Bond over films and cinema",
		},
	];

	return (
		<div className="py-12 px-4 flex items-center justify-center">
			<div className="w-full max-w-2xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
						Chat with a Stranger
					</h1>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Connect with strangers who share the same interests as you across
						the world. Share experiences and have meaningful conversations with
						one another.
					</p>
				</div>

				{/* Options Grid */}
				<div className="grid grid-cols-1 gap-4">
					{options.map((option) => {
						const Icon = option.icon;
						return (
							<Button
								key={option.label}
								variant="outline"
								onClick={option.onClick}
								className="h-auto p-6 flex items-start justify-start gap-4 hover:bg-slate-50 hover:border-primary transition-all duration-200 group"
								asChild
							>
								<div className="w-full text-left">
									<div className="flex items-center gap-4">
										<div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
											<Icon className="w-6 h-6 text-primary" />
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-primary">
												{option.label}
											</h3>
											<p className="text-sm text-muted-foreground mt-1">
												{option.description}
											</p>
										</div>
									</div>
								</div>
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
