import { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { IoBookOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import "./customscroll.css"
import Pdfupload from "./Pdfupload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";

interface UserInfo {
  id: string;
  email: string;
}

interface ChatAreaProps {
  isSelected: string;
  setIsSelected: (id: string) => void;
  user: UserInfo;
}

function ChatArea({ user, isSelected }: ChatAreaProps) {
  const [isBookMarked, setIsBookMarked] = useState(false);
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const queryClient = useQueryClient();
  const [finalMessage, setFinalMessage] = useState("");
  const [chatStage, setChatStage] = useState<"idle" | "active">("idle");
  const { chat_id } = useParams();

  const chatquery = useQuery({
    queryKey: ["messages", chat_id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL!}/chat/${chat_id}/messages`
      );
      setChatStage("idle");
      setFinalMessage("");
      return res.data.messages.map((message) => ({
        ...message,
        is_bot: message.is_bot === "1" ? true : false,
      }));
    },
    disabled: isSelected === "",
  });

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
    mutationFn: async (message: string) => {
      setChatStage("active");
      scrollToBottom();
      const response = await fetch(`${import.meta.env.VITE_API_URL!}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          chat_id: chat_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Create a reader for the streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available on response body.");

      const decoder = new TextDecoder("utf-8");
      let fullMessage = "";
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          // Decode the received chunk and update the message state
          const chunk = decoder.decode(value, { stream: !done });
          fullMessage += chunk;
          setFinalMessage(fullMessage);
          scrollToBottom();
        }
      }

      return fullMessage;
    },
    onSuccess: (data) => {
      // Optionally perform additional actions on success if needed.
      console.log("Final message:", data);
      chatquery.refetch();
    },
    onError: () => {
      setChatStage("idle");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      // const newMessage: Message = {
      //   is_bot: false,
      //   content: currentMessage.trim(),
      // };
      queryClient.setQueryData(["messages", chat_id], (oldData) => [
        ...oldData,
        {
          is_bot: false,
          content: currentMessage.trim(),
        },
      ]);
      sendChatMutation(currentMessage.trim());
      setCurrentMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
      }
    }
  };

  // ... existing code ...
  const uploadSylabus = async (file: File) => {
    console.log({
      file,
    });
    const formData = new FormData();

    formData.append("file", file); // Append the file to the FormData object
    formData.append("chat_id", chat_id);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL!}/upload`, {
        method: "POST",
        body: formData,
        // headers: {
        //   "Content-Type": "multipart/form-data", // Not needed with FormData
        // },
      });
      // const data = await response.json(); // Handle the response
      // console.log(data);
    } catch (error) {
      console.error("Error uploading file:", error); // Handle the error
    }
  };

  const uploadNotes = async (file: File) => {
    console.log({
      file,
    });
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData object
    formData.append("chat_id", chat_id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL!}/upload`, {
        method: "POST",
        body: formData,
        // headers: {
        //   "Content-Type": "multipart/form-data", // Not needed with FormData
        // },
      });
      // const data = await response.json(); // Handle the response
      // console.log(data);
    } catch (error) {
      console.error("Error uploading file:", error); // Handle the error
    }
  };
  // ... existing code ...

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
          <div>Welcome {user.name}!</div>
          <IoBookOutline
            className={`w-6 h-6 cursor-pointer ${
              isBookMarked
                ? "text-primary_green"
                : theme === "dark"
                ? "text-white"
                : "text-black"
            }`}
            onClick={handleBookmark}
          />
        </div>

        <div className="flex-1 flex flex-col px-10 overflow-hidden">
          <div className="flex-1 py-4 px-2 space-y-4 flex flex-col  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent custom-scroll">
            {/* {messages.map((item, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  item.is_bot !== false ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    item.is_bot !== false
                      ? theme === "dark"
                        ? "bg-gray-700"
                        : "bg-white"
                      : "bg-primary_green text-white"
                  } `}
                >
                  {item.content}
                </div>
              </div>
            ))} */}

            {chatquery.data &&
              chatquery.data?.map((item, index) => (
                <div
                  key={index}
                  className={`flex w-full ${
                    item.is_bot !== false ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      item.is_bot !== false
                        ? theme === "dark"
                          ? "bg-gray-700"
                          : "bg-white"
                        : "bg-primary_green text-white"
                    } `}
                  >
                    {item.content}
                  </div>
                </div>
              ))}
            {chatStage === "active" && finalMessage !== "" && (
              <div className={`flex w-full justify-start`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } `}
                >
                  {finalMessage}
                </div>
              </div>
            )}
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
                disabled={chatStage === "active"}
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
                className="p-2 rounded-lg transition-colors text-primary_green hover:bg-primary_green/10
                    disabled:text-gray-400"
                disabled={!currentMessage.trim() && chatStage === "active"}
              >
                <IoSend className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-1/4">
        <div
          className={`h-16 px-10 flex justify-between items-center font-medium text-2xl border-b ${
            theme === "dark" ? "border-white/50" : "border-primary_grey/50"
          }`}
        >
          {/* here is the place for that code  */}
        </div>

        <div className="px-5">
          <div>
            <p className="py-2 pt-3">Upload syllabus</p>
            <Pdfupload uploadFile={uploadSylabus} />
          </div>

          <div>
            <p className="py-2 pt-3">Upload notes</p>
            <Pdfupload uploadFile={uploadNotes} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;