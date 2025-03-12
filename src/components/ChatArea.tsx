import { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { IoBookOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import "./customscroll.css"
import Pdfupload from "./Pdfupload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { DeleteIcon, GraduationCap, WalletCards } from "lucide-react";
import Markdown from "react-markdown";
import { useAuth } from "../contexts/AuthContext";
import FileItem from "./FileItem";
import MCQPanel from "./MCQPanel";
import FlashCardPanel from "./FlashCardPanel";

type ChatMessage = {
  is_bot: boolean;
  content: string;
};

type FileType = {
  file_id: string;
  file_name: string;
  file_type: string;
  status: string;
};

function ChatArea() {
  const [isBookMarked, setIsBookMarked] = useState(false);
  const [openMCQ, setOpenMCQ] = useState(false);
  const [openFlashCard, setOpenFlashCard] = useState(false);
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const queryClient = useQueryClient();
  const [finalMessage, setFinalMessage] = useState("");
  const { user } = useAuth();
  const [chatStage, setChatStage] = useState<"idle" | "loading" | "active">(
    "idle"
  );
  const navigate = useNavigate();
  const { chat_id } = useParams();

  const chatquery = useQuery({
    queryKey: [`messages_${chat_id}`],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL!}/api/chat/${chat_id}/messages`
      );
      setChatStage("idle");
      setFinalMessage("");

      const messages = res.data.messages as ChatMessage[];
      return {
        messages,
        bookmarked: res.data.bookmarked as string,
      };
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL!}/api/chat/${chat_id}/`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });

  const files = useQuery({
    queryKey: [`files_${chat_id}`],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL!}/api/upload/${chat_id}/`
      );
      return res.data as FileType[];
    },
  });

  console.log({ files: files.data });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/chat/bookmark/${chat_id}/`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmark"],
      });
      queryClient.invalidateQueries({
        queryKey: [`messages_${chat_id}`],
      });
    },
  });

  const { mutate: sendChatMutation } = useMutation({
    mutationFn: async (message: string) => {
      setChatStage("loading");
      scrollToBottom();
      const token = localStorage.getItem("token") ?? "";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL!}/api/chat/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            chat_id,
          }),
        }
      );

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
        setChatStage("active");
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
    scrollToBottom();
  }, []);

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

  const handleBookmark = async () => {
    await bookmarkMutation.mutateAsync();
    setIsBookMarked(!isBookMarked);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      queryClient.setQueryData(
        [`messages_${chat_id}`],
        (oldData: { bookmarked: boolean; messages: ChatMessage[] }) => ({
          ...oldData,
          messages: [
            ...oldData.messages,
            {
              is_bot: false,
              content: currentMessage.trim(),
            },
          ],
        })
      );
      sendChatMutation(currentMessage.trim());
      setCurrentMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
      }
    }
  };

  // ... existing code ...
  const uploadSyllabus = async (file: File) => {
    console.log({
      file,
    });
    const formData = new FormData();

    formData.append("file", file);
    formData.append("chat_id", chat_id ?? "");
    formData.append("file_type", "syllabus");

    const token = localStorage.getItem("token") ?? "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL!}/api/upload/new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log(response.status);
      files.refetch();
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
    formData.append("chat_id", chat_id ?? "");
    formData.append("file_type", "notes");

    const token = localStorage.getItem("token") ?? "";
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL!}/api/upload/new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log(response.status);
      files.refetch();
    } catch (error) {
      console.error("Error uploading file:", error); // Handle the error
    }
  };

  const syllabusFile = files.data?.find(
    (file) => file.file_type === "syllabus"
  );

  return (
    <div
      className={`flex max-h-[calc(100svh-2rem)] h-[calc(100svh-2rem)] ${
        theme === "dark"
          ? "bg-primary_grey text-white"
          : "bg-black/10 text-black"
      } flex-1 my-4 mr-4 rounded-[20px] font-roboto`}
    >
      {openMCQ && (
        <MCQPanel onClose={() => setOpenMCQ(false)} chat_id={chat_id ?? ""} />
      )}
      {openFlashCard && (
        <FlashCardPanel
          onClose={() => setOpenFlashCard(false)}
          chat_id={chat_id ?? ""}
        />
      )}
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
          <div className="flex gap-4">
            <button onClick={() => setOpenMCQ(true)}>
              <GraduationCap className="w-6 h-6" />
            </button>
            <button onClick={() => setOpenFlashCard(true)}>
              <WalletCards className="w-6 h-6" />
            </button>

            <button
              onClick={async () => {
                deleteChatMutation.mutateAsync();
                navigate("/chat");
              }}
            >
              <DeleteIcon className="w-6 h-6" />
            </button>
            <IoBookOutline
              className={`w-6 h-6 cursor-pointer ${
                chatquery.data?.bookmarked
                  ? "text-primary_green"
                  : theme === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
              onClick={handleBookmark}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col px-10 overflow-hidden">
          <div className="flex-1 py-4 px-2 space-y-4 flex flex-col  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent custom-scroll">
            {chatquery.data &&
              chatquery.data?.messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex w-full ${
                    item.is_bot !== false ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 [word-break:break-word] ${
                      item.is_bot !== false
                        ? theme === "dark"
                          ? "bg-gray-700"
                          : "bg-white"
                        : "bg-primary_green text-white"
                    } `}
                  >
                    <Markdown>{item.content}</Markdown>
                  </div>
                </div>
              ))}
            {chatStage !== "idle" && (
              <div className={`flex w-full justify-start`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } `}
                >
                  {chatStage === "loading" && "Loading..."}
                  {chatStage === "active" && (
                    <Markdown>{finalMessage}</Markdown>
                  )}
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
          {files.data?.some((file) => file.file_type === "syllabus") ? (
            <div>
              <p className="py-2 pt-3">Syllabus</p>
              <FileItem
                fileid={syllabusFile?.file_id ?? ""}
                key={syllabusFile?.file_id ?? ""}
                filename={syllabusFile?.file_name ?? ""}
                filestatus={syllabusFile?.status ?? ""}
              />
            </div>
          ) : (
            <div>
              <p className="py-2 pt-3">Upload syllabus</p>
              <Pdfupload key="syllabus" uploadFile={uploadSyllabus} />
            </div>
          )}

          <div>
            <p className="py-2 pt-3">Upload notes</p>
            <Pdfupload key="notes" uploadFile={uploadNotes} />
          </div>
          {files.data?.some((file) => file.file_type === "notes") && (
            <div>
              <p className="py-2 pt-3">Notes</p>
              {files.data?.map((file) => {
                if (file.file_type === "notes") {
                  return (
                    <FileItem
                      fileid={file.file_id}
                      key={file.file_id}
                      filename={file.file_name}
                      filestatus={file.status}
                    />
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default ChatArea;