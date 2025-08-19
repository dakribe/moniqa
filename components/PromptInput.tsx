"use client";
import { useState, memo } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "./ui/button";
import {
	PromptInput,
	PromptInputTextarea,
	PromptInputActions,
	PromptInputAction,
} from "./ui/prompt-input";
import { ArrowUp } from "lucide-react";
import { JSXPreview } from "./ui/jsx-preview";

// Memoized component for message parts to prevent unnecessary re-renders
const MessagePart = memo(({ part, messageId, partIndex, isLastMessage, isStreaming }: {
	part: any;
	messageId: string;
	partIndex: number;
	isLastMessage: boolean;
	isStreaming: boolean;
}) => {
	const parseMessageContent = (
		content: string,
	):
		| { type: "jsx"; code: string; explanation: string }
		| { type: "text"; content: string } => {
		// Check if the content contains JSX component code in code blocks
		const hasJsxBlock =
			content.includes("```jsx") ||
			content.includes("```html") ||
			(content.includes("```") &&
				(content.includes("<div") ||
					content.includes("<button") ||
					content.includes("<span") ||
					content.includes("<ResponsiveContainer")));

		if (hasJsxBlock) {
			// Extract the JSX code - more flexible regex patterns
			const jsxMatch =
				content.match(/```jsx\s*([\s\S]*?)\s*```/) ||
				content.match(/```html\s*([\s\S]*?)\s*```/) ||
				content.match(/```typescript\s*([\s\S]*?)\s*```/) ||
				content.match(/```ts\s*([\s\S]*?)\s*```/) ||
				content.match(/```javascript\s*([\s\S]*?)\s*```/) ||
				content.match(/```js\s*([\s\S]*?)\s*```/) ||
				content.match(/```\s*([\s\S]*?)\s*```/);

			if (
				jsxMatch &&
				jsxMatch[1] &&
				(jsxMatch[1].includes("<") ||
					jsxMatch[1].includes("div") ||
					jsxMatch[1].includes("button") ||
					jsxMatch[1].includes("ResponsiveContainer"))
			) {
				return {
					type: "jsx",
					code: jsxMatch[1].trim(),
					explanation: content.split("```")[0].trim(), // Text before the code block
				};
			}
		}

		// Check if content contains JSX directly (without code blocks)
		const hasDirectJsx = 
			content.includes("<ResponsiveContainer") ||
			content.includes("<BarChart") ||
			content.includes("<LineChart") ||
			content.includes("<PieChart") ||
			(content.includes("<div") && content.includes("className="));

		if (hasDirectJsx) {
			// Try to extract JSX that starts with < and ends with >
			const jsxMatch = content.match(/<[^>]*>[\s\S]*<\/[^>]*>/);
			if (jsxMatch) {
				// Find the explanation text before the JSX
				const jsxStart = content.indexOf(jsxMatch[0]);
				const explanation = content.substring(0, jsxStart).trim();
				
				return {
					type: "jsx",
					code: jsxMatch[0].trim(),
					explanation: explanation
				};
			}
		}

		return {
			type: "text",
			content: content,
		};
	};

	if (part.type === "text") {
		const parsed = parseMessageContent(part.text);
		console.log("Parsed message:", { type: parsed.type, content: part.text.substring(0, 200) });

		if (parsed.type === "jsx") {
			return (
				<div key={`${messageId}-${partIndex}`} className="space-y-4">
					{parsed.explanation && (
						<div className="text-sm text-gray-600 whitespace-pre-wrap">
							{parsed.explanation}
						</div>
					)}
					<div className="border rounded-lg p-4">
						<JSXPreview 
							jsx={parsed.code} 
							isStreaming={isStreaming && isLastMessage} 
						/>
					</div>
				</div>
			);
		}

		return (
			<div key={`${messageId}-${partIndex}`} className="whitespace-pre-wrap">
				{parsed.content}
			</div>
		);
	}
	return null;
});

MessagePart.displayName = 'MessagePart';

export function PromptInputBasic() {
	const [input, setInput] = useState("");
	const { messages, sendMessage, status } = useChat();

	const handleSubmit = (e?: React.FormEvent) => {
		e?.stopPropagation();
		e?.preventDefault();
		sendMessage({ text: input });
		setInput("");
	};

	return (
		<div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch">
			{messages.map((message) => (
				<div key={message.id} className="mb-4">
					<div className="font-semibold mb-2">
						{message.role === "user" ? "You: " : "AI: "}
					</div>
					{message.parts.map((part, i) => (
						<MessagePart
							key={`${message.id}-${i}`}
							part={part}
							messageId={message.id}
							partIndex={i}
							isLastMessage={message.id === messages[messages.length - 1]?.id}
							isStreaming={status === 'streaming'}
						/>
					))}
				</div>
			))}

			<PromptInput
				value={input}
				onValueChange={setInput}
				onSubmit={handleSubmit}
			>
				<PromptInputTextarea placeholder="Ask about your financial data..." />
				<PromptInputActions className="justify-end pt-2">
					<PromptInputAction tooltip="Send message">
						<Button
							variant="default"
							size="icon"
							className="h-8 w-8 rounded-full"
							onClick={handleSubmit}
						>
							<ArrowUp className="size-5" />
						</Button>
					</PromptInputAction>
				</PromptInputActions>
			</PromptInput>
		</div>
	);
}
