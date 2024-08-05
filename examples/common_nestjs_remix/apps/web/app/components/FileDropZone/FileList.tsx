import { isEmpty } from "lodash-es";
import { Label } from "../ui/label";
import FileListItemIcon from "./FileListIcon";
import FileListItem from "./FileListItem";
import pluralize from "pluralize";

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export default function FileList({ files, onRemoveFile }: FileListProps) {
  if (isEmpty(files)) return null;

  return (
    <div className="space-y-2">
      <Label>Selected {pluralize("file", files.length)}</Label>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <FileListItem
            key={`${file.name}-${index}`}
            index={index}
            file={file}
            onRemove={onRemoveFile}
            icon={<FileListItemIcon fileName={file.name} className="h-6 w-6" />}
          />
        ))}
      </ul>
    </div>
  );
}
