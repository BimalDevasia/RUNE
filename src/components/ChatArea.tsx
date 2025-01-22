import { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { IoBookOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import "./customscroll.css"
interface Message {
  type: "incoming" | "outgoing";
  message: string;
  timestamp?: Date;
}

interface UserInfo {
  id: string;
  email: string;
}

interface ChatAreaProps {
  isSelected: string;
  setIsSelected: (id: string) => void;
  user: UserInfo;
}

function ChatArea({ user }: ChatAreaProps) {
  const [isBookMarked, setIsBookMarked] = useState(false);
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessage, setCurrentMessage] = useState("");

  const messageDummy: Message[] = [
    { type: "outgoing", message: "hello", timestamp: new Date() },
    { type: "incoming", message: "how are you", timestamp: new Date() },
    { type: "outgoing", message: "fine", timestamp: new Date() },
    { type: "incoming", message: "what do you want", timestamp: new Date() },
  ];

  const [messages, setMessages] = useState<Message[]>(messageDummy);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "inherit";
      const computed = window.getComputedStyle(textarea);
      const height =
        parseInt(computed.getPropertyValue("border-top-width"), 10) +
        parseInt(computed.getPropertyValue("padding-top"), 10) +
        textarea.scrollHeight +
        parseInt(computed.getPropertyValue("padding-bottom"), 10) +
        parseInt(computed.getPropertyValue("border-bottom-width"), 10);

      textarea.style.height = `${Math.min(height, 150)}px`;
    }
  }, [currentMessage]);

  const handleBookmark = () => {
    setIsBookMarked(!isBookMarked);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      const newMessage: Message = {
        type: "outgoing",
        message: currentMessage.trim(),
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setCurrentMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
      }
    }
  };

  return (
    <div
      className={`flex max-h-[calc(100svh-2rem)] h-[calc(100svh-2rem)] ${
        theme === "dark"
          ? "bg-primary_grey text-white"
          : "bg-primary_grey/30 text-black"
      } flex-1 my-4 mr-4 rounded-[20px] font-roboto`}
    >
      <div
        className={`flex-1 border-r-[0.5px] flex flex-col ${
          theme === "dark" ? "border-white/50" : "border-primary_grey/50"
        } h-full`}
      >
        <div
          className={`h-16 px-10 flex justify-between items-center font-medium text-2xl border-b ${
            theme === "dark" ? "border-white/50" : "border-primary_grey/50"
          }`}
        >
          <div>Welcome {user.id}!</div>
          <IoBookOutline
            className={`w-6 h-6 cursor-pointer ${
              isBookMarked ? "text-primary_green" : "text-white"
            }`}
            onClick={handleBookmark}
          />
        </div>

        <div className="flex-1 flex flex-col px-10 overflow-hidden">
          <div className="flex-1 py-4 px-2 space-y-4 flex flex-col  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent custom-scroll">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  item.type === "incoming" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    item.type === "incoming"
                      ? theme === "dark"
                        ? "bg-gray-700"
                        : "bg-gray-200"
                      : "bg-primary_green text-white"
                  } `}
                >
                  {item.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="relative w-full max-w-4xl mx-auto mb-6"
          >
            <div
              className={`relative flex items-center border rounded-xl p-2 ${
                theme === "dark"
                  ? "bg-primary_grey border-white/20"
                  : "bg-white border-primary_grey/20"
              } `}
            >
              <textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Send a message..."
                className={`w-full resize-none max-h-[150px] outline-none py-3 px-4 ${
                  theme === "dark"
                    ? "bg-primary_grey text-white placeholder:text-white/50"
                    : "bg-white text-black placeholder:text-black/50"
                } custom-scroll`}
                rows={1}
              />
              <button
                type="submit"
                className={`p-2 rounded-lg transition-colors ${
                  currentMessage.trim()
                    ? "text-primary_green hover:bg-primary_green/10"
                    : "text-gray-400"
                }`}
                disabled={!currentMessage.trim()}
              >
                <IoSend className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-1/4"></div>
    </div>
  );
}

export default ChatArea;