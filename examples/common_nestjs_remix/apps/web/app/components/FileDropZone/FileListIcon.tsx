import React from "react";
import {
  LucideProps,
  FileText,
  FileAudio,
  FileVideo,
  FileSpreadsheet,
  FileQuestion,
} from "lucide-react";
import { last } from "lodash-es";

interface FileListItemIconProps extends LucideProps {
  fileName: string;
}

const FILE_TYPES = [
  { extensions: ["txt", "doc", "docx", "pdf"], Icon: FileText },
  { extensions: ["mp3", "wav", "ogg"], Icon: FileAudio },
  { extensions: ["mp4", "avi", "mov"], Icon: FileVideo },
  { extensions: ["xls", "xlsx", "csv"], Icon: FileSpreadsheet },
];

function getFileIcon(fileName: string): React.ComponentType<LucideProps> {
  const extension = last(fileName.split("."))?.toLowerCase();
  if (!extension) return FileQuestion;

  const fileType = FILE_TYPES.find((type) =>
    type.extensions.includes(extension)
  );
  return fileType ? fileType.Icon : FileQuestion;
}

export default function FileListItemIcon({
  fileName,
  ...props
}: FileListItemIconProps) {
  const Icon = getFileIcon(fileName);
  return <Icon {...props} />;
}
