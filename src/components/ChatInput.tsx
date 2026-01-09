import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isRecording: boolean;
  toggleRecording: () => void;
}

export default function ChatInput({ input, setInput, handleSend, isRecording, toggleRecording }: ChatInputProps) {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-b-lg">
      <Input
        type="text"
        placeholder="Rubuta sakonka a nan..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 bg-gray-100 dark:bg-gray-600 border-none focus:ring-0 rounded-full px-4"
      />
      <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex-shrink-0">
        <Send className="h-5 w-5" />
      </Button>
      <Button onClick={toggleRecording} size="icon" variant={isRecording ? "destructive" : "outline"} className="rounded-full w-10 h-10 flex-shrink-0">
        <Mic className="h-5 w-5" />
      </Button>
    </div>
  );
}