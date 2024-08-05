import { match } from "ts-pattern";
import { X } from "lucide-react";
import { Button } from "../ui/button";

type FileListItemProps = {
  onRemove: (indexToRemove: number) => void;
  file: File;
  icon?: React.ReactNode;
  index: number;
};

export default function FileListItem({
  file,
  onRemove,
  icon,
  index,
}: FileListItemProps) {
  const fileIcon = match(file.type)
    .when(
      (type) => type.startsWith("image/"),
      () => (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="w-10 h-10 object-cover rounded"
        />
      )
    )
    .otherwise(() => {
      return <div className="p-2">{icon}</div>;
    });

  return (
    <li className="flex items-center justify-between p-2 border rounded-md group">
      <div className="flex items-center space-x-2">
        {fileIcon}
        <span className="text-sm text-primary">{file.name}</span>
      </div>
      <Button
        variant="ghost"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700 focus:outline-none hidden group-hover:block"
        aria-label="Remove file"
      >
        <X className="w-5 h-5" />
      </Button>
    </li>
  );
}
