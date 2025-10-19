import { LogOut, Send, UserCircle2, Users } from "lucide-react";
import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import type { WSMessage } from "@/lib/types";

type ChatProps = {
	isConnected: boolean;
	onDisconnect: () => void;
	messages: WSMessage[];
	setMessages: React.Dispatch<React.SetStateAction<WSMessage[]>>;
	onSendMessage: (message: string) => void;
	otherName: string;
	yourName: string;
	alertMessage: string | null;
	// isOtherTyping: boolean;
};

export default function Chat({
	isConnected,
	onDisconnect,
	messages,
	setMessages,
	onSendMessage,
	otherName,
	yourName,
	alertMessage,
	// isOtherTyping,
}: ChatProps) {
	const [inputValue, setInputValue] = useState<string>("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { data: session } = authClient.useSession();

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (messages) {
			scrollToBottom();
		}
	}, [messages, scrollToBottom]);

	const handleSendMessage = () => {
		if (inputValue.trim() === "") return;

		const newMessage: WSMessage = {
			type: "MESSAGE",
			message: inputValue,
			from: session?.user.id ?? "",
		};

		setMessages((prev) => [...prev, newMessage]);

		if (onSendMessage) {
			onSendMessage(inputValue);
		}

		setInputValue("");
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-4xl h-[600px] flex flex-col border-border bg-card">
				{/* Header */}
				<div className="border-b border-border p-4 flex items-center justify-between bg-muted/30">
					<div className="flex items-center gap-3">
						<div className="relative">
							<Users className="w-5 h-5 text-primary" />
							<span
								className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${isConnected ? "text-primary" : "text-red-600"}`}
							></span>
						</div>
						<div>
							<h3 className="font-semibold text-foreground">
								Chat with {otherName}
							</h3>
							<p className="text-xs text-muted-foreground capitalize">
								{isConnected ? "connected" : "disconnected"}
							</p>
						</div>
					</div>

					{onDisconnect && (
						<Button
							onClick={onDisconnect}
							variant="outline"
							size="sm"
							className="gap-2"
						>
							<LogOut className="w-4 h-4" />
							Disconnect
						</Button>
					)}
				</div>

				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages.length === 0 && (
						<Alert className="bg-muted/50 border-border">
							<AlertDescription className="text-muted-foreground text-center">
								{alertMessage}
							</AlertDescription>
						</Alert>
					)}

					{messages.map((message, index) => (
						<div
							// The messages are just appending, we wont change or delete them, so orders won't change
							// That means we are good to just use index for simple cases.
							// biome-ignore lint: Avoid using the index as key property in an element.
							key={index}
							className={`flex gap-3 ${message.from === session?.user.id ? "flex-row-reverse" : "flex-row"}`}
						>
							<div className="flex-shrink-0">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center ${
										message.from === session?.user.id
											? "bg-primary/10"
											: "bg-muted"
									}`}
								>
									<UserCircle2
										className={`w-5 h-5 ${
											message.from === session?.user.id
												? "text-primary"
												: "text-muted-foreground"
										}`}
									/>
								</div>
							</div>

							<div
								className={`flex flex-col ${message.from === session?.user.id ? "items-end" : "items-start"} max-w-[70%]`}
							>
								<span className="text-xs text-muted-foreground mb-1">
									{message.from === session?.user.id ? yourName : otherName}
								</span>
								<div
									className={`rounded-lg px-4 py-2 ${
										message.from === session?.user.id
											? "bg-primary text-primary-foreground"
											: "bg-muted text-foreground"
									}`}
								>
									<p className="text-sm whitespace-pre-wrap break-words">
										{message.message}
									</p>
								</div>
							</div>
						</div>
					))}

					{!isConnected && (
						<Alert className="bg-muted/50 border-border">
							<AlertDescription className="text-muted-foreground text-center">
								{alertMessage}
							</AlertDescription>
						</Alert>
					)}

					{/*{isOtherTyping && (
						<div className="flex gap-3">
							<div className="flex-shrink-0">
								<div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
									<UserCircle2 className="w-5 h-5 text-muted-foreground" />
								</div>
							</div>
							<div className="flex flex-col items-start">
								<span className="text-xs text-muted-foreground mb-1">
									{otherName}
								</span>
								<div className="rounded-lg px-4 py-2 bg-muted">
									<div className="flex gap-1">
										<span
											className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
											style={{ animationDelay: "0ms" }}
										></span>
										<span
											className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
											style={{ animationDelay: "150ms" }}
										></span>
										<span
											className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
											style={{ animationDelay: "300ms" }}
										></span>
									</div>
								</div>
							</div>
						</div>
					)}*/}

					<div ref={messagesEndRef} />
				</div>

				{/* Input Area */}
				<div className="border-t border-border p-4 bg-muted/30">
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Type a message..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyUp={handleKeyPress}
							disabled={!isConnected}
							className="flex-1 bg-background"
						/>
						<Button
							onClick={handleSendMessage}
							disabled={!isConnected}
							className="gap-2"
						>
							<Send className="w-4 h-4" />
							Send
						</Button>
					</div>
					<p className="text-xs text-muted-foreground mt-2">
						Press Enter to send
					</p>
				</div>
			</Card>
		</div>
	);
}
