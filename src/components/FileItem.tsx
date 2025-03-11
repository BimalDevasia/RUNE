import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DeleteIcon, File } from "lucide-react";
import { useParams } from "react-router";

function FileItem(props: {
  filename: string;
  fileid: string;
  filestatus: string;
}) {
  const queryClient = useQueryClient();
  const { chat_id } = useParams();

  const progressQuery = useQuery({
    queryKey: [`progress_${props.fileid}`],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL!}/api/upload/progress/${props.fileid}`
      );

      if (res.data.completed) {
        queryClient.invalidateQueries({
          queryKey: [`files_${chat_id}`],
        });
      }
      return res.data.progress;
    },

    refetchInterval() {
      if (props.filestatus === "pending") {
        return 1000;
      }
    },
    enabled: props.filestatus === "pending",
  });

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/upload/delete/${props.fileid}`,
        {
          chat_id,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`files_${chat_id}`],
      });
    },
  });
  return (
    <div className="px-4 py-3 rounded-sm border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File className="w-6 h-6" />
          <p className="text-sm [word-break:break-word]">{props.filename}</p>
        </div>
        <button
          onClick={() => {
            deleteFileMutation.mutateAsync();
          }}
        >
          <DeleteIcon className="w-6 h-6" />
        </button>
      </div>
      {props.filestatus === "pending" && (
        <p>processing ({parseFloat(progressQuery.data ?? 100).toFixed(2)} %)</p>
      )}
    </div>
  );
}

export default FileItem;
