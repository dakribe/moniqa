import { PromptInputBasic } from "@/components/PromptInput";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1 flex items-center justify-center"></div>
			<div className="p-4 pb-6">
				<div className="max-w-2xl mx-auto">
					<PromptInputBasic />
				</div>
			</div>
		</div>
	);
}
