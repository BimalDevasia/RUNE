import { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { IoSend } from "react-icons/io5";
import "./customscroll.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function NewChat() {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // const pdfquery = useQuery({
  //   queryKey: ["messages", isSelected],
  //   queryFn: async () => {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_API_URL!}/chat/${isSelected}/pdfs`
  //     );
  //     return {};
  //   },
  //   disabled: isSelected === "",
  // });

  const { mutate: sendChatMutation } = useMutation({
    mutationFn: async (title: string) => {
      return axios.post(`${import.meta.env.VITE_API_URL!}/api/chat/new`, {
        title,
      });
    },
    onSuccess: (data) => {
      // Optionally perform additional actions on success if needed.
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      console.log({
        data,
      });
      navigate(`/chat/${data.data.chat_id}`);
    },
    onError: () => {},
  });

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      sendChatMutation(currentMessage.trim());
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
          : "bg-black/10 text-black"
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
          <div>Welcome {user?.name}!</div>
        </div>

        <div className="flex-1 flex flex-col px-10 overflow-hidden">
          <div className="flex-1 py-4 px-2 space-y-4 flex flex-col  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent custom-scroll">
            <div className="flex h-full items-center justify-center">
              <h1 className="text-6xl font-medium">Start a new chat</h1>
            </div>
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
                placeholder="Enter name of Chat"
                className={`w-full resize-none max-h-[150px] outline-none py-3 px-4 ${
                  theme === "dark"
                    ? "bg-primary_grey text-white placeholder:text-white/50"
                    : "bg-white text-black placeholder:text-black/50"
                } custom-scroll`}
                rows={1}
              />
              <button
                type="submit"
                className="p-2 rounded-lg transition-colors text-primary_green hover:bg-primary_green/10
                    disabled:text-gray-400"
                disabled={!currentMessage.trim()}
              >
                <IoSend className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewChat;
