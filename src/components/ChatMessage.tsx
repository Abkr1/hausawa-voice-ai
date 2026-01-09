interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  const bubbleClasses = isUser
    ? "bg-blue-600 text-white self-end rounded-br-none"
    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white self-start rounded-bl-none";

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-lg p-3 rounded-xl shadow-md ${bubbleClasses}`}>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}