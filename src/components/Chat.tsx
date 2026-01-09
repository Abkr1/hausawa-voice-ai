import { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface Message {
  text: string;
  isUser: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { speak } = useTextToSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Greet user on component mount
    const initialMessage: Message = { text: "Sannu! Ni ce Sautin AI, mai taimaka maka da murya. Ta yaya zan iya taimaka maka a yau?", isUser: false };
    setMessages([initialMessage]);
    speak(initialMessage.text);
  }, [speak]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ha-NG';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setInput(speechResult);
        handleSend(speechResult);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
    } else {
        console.warn("Speech recognition not supported in this browser.");
    }
  }

  useEffect(() => {
    setupRecognition();
  }, []);

  const toggleRecording = () => {
      if (!recognitionRef.current) return;
      if (isRecording) {
          recognitionRef.current.stop();
          setIsRecording(false);
      } else {
          recognitionRef.current.start();
          setIsRecording(true);
      }
  }

  const handleSend = (textToSend?: string) => {
    const currentText = textToSend || input;
    if (currentText.trim()) {
      const userMessage: Message = { text: currentText, isUser: true };
      setMessages(prev => [...prev, userMessage]);

      // Placeholder for AI response logic
      setTimeout(() => {
        const aiResponse: Message = { text: `Na ji ka ce: \"${currentText}\". Yanzu haka ina sarrafa bukatarka...`, isUser: false };
        setMessages(prev => [...prev, aiResponse]);
        speak(aiResponse.text);
      }, 1000);

      if (!textToSend) {
        setInput("");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full h-[75vh] flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={() => handleSend()}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
      />
    </div>
  );
}