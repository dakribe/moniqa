"use client";

import { useState } from "react";
import {
	PromptInput,
	PromptInputAction,
	PromptInputActions,
	PromptInputTextarea,
} from "./ui/prompt-input";
import { Square, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { useChat } from "@ai-sdk/react";

export function PromptInputBasic() {
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { messages, sendMessage, status } = useChat();

	const handleSubmit = (e?: React.FormEvent) => {
		e?.stopPropagation();
		e?.preventDefault();
		sendMessage({ text: input });
		setInput("");
	};

	const handleValueChange = (value: string) => {
		setInput(value);
	};

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{messages.map((message) => (
				<div key={message.id} className="whitespace-pre-wrap">
					{message.role === "user" ? "User: " : "AI: "}
					{message.parts.map((part, i) => {
						switch (part.type) {
							case "text":
								return <div key={`${message.id}-${i}`}>{part.text}</div>;
							default:
								return null;
						}
					})}
				</div>
			))}
			<PromptInput
				value={input}
				onValueChange={handleValueChange}
				isLoading={isLoading}
				onSubmit={handleSubmit}
			>
				<PromptInputTextarea placeholder="Ask me anything..." />
				<PromptInputActions className="justify-end pt-2">
					<PromptInputAction
						tooltip={isLoading ? "Stop generation" : "Send message"}
					>
						<Button
							variant="default"
							size="icon"
							className="h-8 w-8 rounded-full"
							onClick={handleSubmit}
						>
							{isLoading ? (
								<Square className="size-5 fill-current" />
							) : (
								<ArrowUp className="size-5" />
							)}
						</Button>
					</PromptInputAction>
				</PromptInputActions>
			</PromptInput>
		</div>
	);
}
