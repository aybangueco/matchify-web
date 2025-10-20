import { Globe, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type FindingMatchProps = {
	onCancel?: () => void;
	searchText?: string;
	cancelText?: string;
};

export default function FindingMatch({
	onCancel,
	searchText = "Finding someone for you to chat with...",
	cancelText = "Stop",
}: FindingMatchProps) {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="mt-36 flex items-center justify-center p-4">
			<Card className="w-full max-w-md border-border bg-card">
				<CardContent className="pt-6 pb-6">
					<div className="flex flex-col items-center space-y-6">
						{/* Animated Icon */}
						<div className="relative">
							<div className="absolute inset-0 animate-ping opacity-20">
								<div className="w-20 h-20 rounded-full bg-primary"></div>
							</div>
							<div className="relative bg-primary/10 p-5 rounded-full">
								<Loader2 className="w-10 h-10 text-primary animate-spin" />
							</div>
						</div>

						{/* Status Text */}
						<div className="text-center space-y-2">
							<h2 className="text-xl font-semibold text-foreground">
								{searchText}
								<span className="inline-block w-8 text-left">{dots}</span>
							</h2>
							<p className="text-sm text-muted-foreground">
								This may take a moment
							</p>
						</div>

						{/* Loading Bar */}
						<div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
							<div
								className="h-full bg-primary animate-pulse rounded-full"
								style={{ width: "60%" }}
							></div>
						</div>

						{/* Cancel Button */}
						{onCancel && (
							<button
								type="button"
								onClick={onCancel}
								className="mt-4 px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-accent transition-colors"
							>
								{cancelText}
							</button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
