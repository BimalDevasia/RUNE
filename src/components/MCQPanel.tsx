import { XIcon } from "lucide-react";
import MCQArea from "./MCQArea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const MCQPanel = ({
  chat_id,
  onClose,
}: {
  chat_id: string;
  onClose: () => void;
}) => {
  const [mcqFetched, setMCQFetched] = useState(false);
  const [input, setInput] = useState("");
  const mcqMutation = useMutation({
    mutationFn: async (keywords: string) => {
      const parsedkeywords = keywords.split(",");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mcq/${chat_id}/`,
        {
          keywords: parsedkeywords,
        }
      );

      console.log(res.data);

      const cleanedText = res.data.data
        .replace("```json", "")
        .replace("```", "")
        .trim();

      const parsedData = JSON.parse(cleanedText);
      if (parsedData.questions) {
        return parsedData.questions;
      }
      return parsedData;
    },
    onSuccess: () => {
      setMCQFetched(true);
    },
  });
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-primary_grey rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-4 rounded-full bg-primary_grey p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="bg-primary_grey  px-4 pb-4 sm:p-10 sm:pb-4">
            {!mcqFetched && (
              <div className="space-y-3">
                <h3 className="text-center text-2xl font-medium">
                  Enter the section titles for generating MCQs
                </h3>
                <input
                  className="w-full py-1 px-2 text-black text-xl placeholder:text-lg"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter section titles separated by commas"
                />
                <button
                  className="bg-primary_green w-full text-white text-lg py-1 px-2 rounded-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => mcqMutation.mutateAsync(input)}
                  disabled={mcqMutation.isPending}
                >
                  {mcqMutation.isPending ? "Generating..." : "Generate MCQs"}
                </button>
              </div>
            )}
            {mcqFetched && <MCQArea data={mcqMutation.data} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQPanel;
