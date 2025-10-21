import { LogOut, Send, UserCircle2, UserPlus, Users } from "lucide-react";
import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
	isOtherTyping: boolean;
	handleTyping: () => void;
};

export default function Chat({
	isConnected,
	onDisconnect,
	messages,
	setMessages,
	onSendMessage,
	otherName,
	yourName,
	isOtherTyping,
	handleTyping,
}: ChatProps) {
	const [inputValue, setInputValue] = useState<string>("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { data: session } = authClient.useSession();

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (messages || isOtherTyping) {
			scrollToBottom();
		}
	}, [messages, isOtherTyping, scrollToBottom]);

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

		if (e.key !== "Enter") {
			handleTyping();
		}
	};

	return (
		<div className="p-4 flex justify-center items-center">
			<div className="w-full max-w-4xl h-[800px] max-h-[800px] flex flex-col">
				{/* Header */}
				<div className=" p-4 flex items-center justify-between bg-muted/30">
					<div className="flex items-center gap-3">
						<div className="relative">
							<Users
								className={`w-5 h-5 ${isConnected ? "text-primary" : "text-destructive"}`}
							/>
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

					<div className="flex gap-2">
						<Button disabled={!isConnected} variant="outline" size="sm">
							<UserPlus />
							Add
						</Button>

						<Button onClick={onDisconnect} variant="outline" size="sm">
							<LogOut className="w-4 h-4" />
							Disconnect
						</Button>
					</div>
				</div>

				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-full h-full">
					{messages.map((message, index) => (
						<div
							// The messages are just appending, we wont change or delete them, so orders won't change
							// That means we are good to just use index for simple cases.
							// biome-ignore lint: Avoid using the index as key property in an element.
							key={index}
							className={`flex gap-3 ${message.from === session?.user.id ? "flex-row-reverse" : "flex-row"}`}
						>
							{message.from === "SYSTEM" ? (
								<Alert className="bg-muted/50 border-border">
									<AlertDescription className="text-muted-foreground text-center">
										{message.message}
									</AlertDescription>
								</Alert>
							) : (
								<>
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
								</>
							)}
						</div>
					))}

					{isOtherTyping && (
						<div>
							<p className="text-sm text-muted-foreground">
								{otherName} is typing...
							</p>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Area */}
				<div className="border-t border-border p-4 bg-muted/30">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSendMessage();
						}}
						className="flex gap-2"
					>
						<Input
							type="text"
							placeholder="Type a message..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyUp={handleKeyPress}
							disabled={!isConnected}
							className="flex-1 bg-background"
						/>
						<Button disabled={!isConnected} className="gap-2">
							<Send className="w-4 h-4" />
							Send
						</Button>
					</form>
					<p className="text-xs text-muted-foreground mt-2">
						Press Enter to send
					</p>
				</div>
			</div>
		</div>
	);
}
