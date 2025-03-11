import React, { useState, useCallback, useId } from "react";
import { Upload } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { twMerge } from "tailwind-merge";

interface PDFUploadProps {
  onFileUpload?: (file: File) => void;
  uploadFile: (file: File) => Promise<void>;
}

interface ThemeContextType {
  theme: "dark" | "light";
}

function PDFUpload({ onFileUpload, uploadFile }: PDFUploadProps): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useTheme() as ThemeContextType;

  // Generate a unique id for the file input
  const fileInputId = useId();

  const clearpdf = () => {
    setFile(null);
  };

  const handleDrag = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile?.type === "application/pdf") {
        setFile(droppedFile);
        onFileUpload?.(droppedFile);
      }
    },
    [onFileUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      onFileUpload?.(selectedFile);
    }
  };

  return (
    <form action="">
      <div
        className={twMerge(
          "w-full p-2 rounded-lg flex flex-col justify-center items-center",
          theme === "dark" ? "bg-black" : "bg-white"
        )}
      >
        <div className="w-full">
          <div
            className={twMerge(
              "border-2 border-dashed rounded-lg w-full text-center cursor-pointer h-[67px] flex justify-center items-center",
              isDragging
                ? "border-primary_green bg-primary_green/10"
                : theme === "dark"
                ? "border-white/20 bg-white/20"
                : "border-primary_grey/20 bg-black/20",
              file ? "bg-primary_green/5" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id={fileInputId} // Use the unique id here
            />
            <label htmlFor={fileInputId} className="cursor-pointer">
              <Upload className="mx-auto w-3 h-3 text-primary_green mb-2" />
              {file ? (
                <p
                  className={`text-[11px] ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {file.name}
                </p>
              ) : (
                <div>
                  <p
                    className={twMerge(
                      "text-sm",
                      theme === "dark" ? "text-white/50" : "text-black/50"
                    )}
                  >
                    Drag and Drop file here
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="w-full pt-2">
          <div className="flex gap-3 w-full text-sm">
            <button
              onClick={clearpdf}
              className={twMerge(
                "flex-1 justify-center items-center flex rounded-md py-1",
                theme === "dark" ? "bg-white/20" : "bg-black/20"
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (file) {
                  setLoading(true);
                  await uploadFile(file);
                  clearpdf();
                  setLoading(false);
                }
              }}
              className="flex-1 justify-center items-center flex rounded-md py-1 bg-primary_green"
              disabled={!file}
            >
              {loading ? "Loading" : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PDFUpload;
