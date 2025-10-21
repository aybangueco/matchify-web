import { createFileRoute } from "@tanstack/react-router";
import { Disc3, Film, type LucideProps, Music } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import Metadata from "@/components/page/metadata";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/use-debounce";
import type {
	ConnectedTo,
	Find,
	WSDataContext,
	WSMessage,
	WSState,
} from "@/lib/types";
import { useAuth } from "@/modules/auth/components/auth-provider";
import { Chat, FindingMatch } from "@/modules/find";

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
	const { session } = useAuth();
	const [find, setFind] = useState<Find | null>(null);
	const [isFinding, setIsFinding] = useState<boolean>(false);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [connectedTo, setConnectedTo] = useState<ConnectedTo | null>(null);

	const [messages, setMessages] = useState<WSMessage[]>([]);
	const [isOtherTyping, setIsOtherTyping] = useState<boolean>(false);
	const isTyping = useRef<boolean>(false);
	const debounceTyping = useDebounce();

	const [socketURL, setSocketURL] = useState<string | null>(null);
	const {
		lastJsonMessage,
		sendJsonMessage,
	}: { lastJsonMessage: WSDataContext; sendJsonMessage: SendJsonMessage } =
		useWebSocket(socketURL);

	const handleTyping = useCallback(() => {
		if (!isTyping.current) {
			isTyping.current = true;
			sendJsonMessage<WSState>({
				type: "STATE",
				typing: isTyping.current,
				from: session?.user.id ?? "",
			});
		}

		debounceTyping(() => {
			isTyping.current = false;
			sendJsonMessage<WSState>({
				type: "STATE",
				typing: isTyping.current,
				from: session?.user.id ?? "",
			});
		}, 500);
	}, [sendJsonMessage, session, debounceTyping]);

	const onSendMessage = (message: string) => {
		const newMessage: WSMessage = {
			type: "MESSAGE",
			message,
			from: session?.user.id ?? "",
		};
		sendJsonMessage<WSMessage>(newMessage);
	};

	const onClickCancel = () => {
		setFind(null);
		setSocketURL(null);
		setIsFinding(false);
		setMessages([]);
		setConnectedTo(null);
	};

	const onClickFindArtist = () => {
		setFind("ARTISTS");
		setSocketURL("ws://localhost:8080/chat/artist");
		setIsFinding(true);
	};

	const options: Option[] = [
		{
			icon: Music,
			label: "Find Strangers Based on Artists",
			description: "Connect over your favorite musicians and artists",
			onClick: onClickFindArtist,
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

	// Managing connection state of users
	useEffect(() => {
		console.log(lastJsonMessage);

		if (lastJsonMessage && lastJsonMessage.type === "DISCONNECTED") {
			setSocketURL(null);
			setIsConnected(false);
		} else if (lastJsonMessage && lastJsonMessage.type === "CONNECTED") {
			if (lastJsonMessage.connectedTo) {
				setConnectedTo(lastJsonMessage.connectedTo);
			}

			setIsFinding(false);
			setIsConnected(true);
		} else if (lastJsonMessage && lastJsonMessage.type === "MESSAGE") {
			setMessages((prev) => [...prev, lastJsonMessage]);
		} else if (lastJsonMessage && lastJsonMessage.type === "STATE") {
			setIsOtherTyping(lastJsonMessage.typing);
		}
	}, [lastJsonMessage]);

	// Finding users to match
	if (isFinding) {
		return <FindingMatch onCancel={onClickCancel} />;
	}

	if (find === "ARTISTS" && !isFinding) {
		return (
			<Chat
				messages={messages}
				setMessages={setMessages}
				onSendMessage={onSendMessage}
				isConnected={isConnected}
				onDisconnect={() => onClickCancel()}
				otherName={connectedTo?.username ?? ""}
				yourName={session?.user.username ?? ""}
				isOtherTyping={isOtherTyping}
				handleTyping={handleTyping}
			/>
		);
	}

	return (
		<div className="py-12 px-4 flex items-center justify-center">
			<Metadata
				title="Find | Matchify"
				description="Setup your matchify profile"
			/>
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
