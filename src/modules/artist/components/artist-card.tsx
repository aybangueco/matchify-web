import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ArtistCard({
	artistName,
	onClickDelete,
}: {
	artistName: string;
	onClickDelete: () => void;
}) {
	return (
		<Card className="p-4 flex flex-row justify-between items-start hover:shadow-md transition-shadow">
			<div className="flex-1">
				<p className="font-medium text-sm">{artistName}</p>
			</div>
			<button
				type="button"
				onClick={onClickDelete}
				className="text-muted-foreground hover:text-destructive transition-colors"
			>
				<X className="h-4 w-4" />
			</button>
		</Card>
	);
}
