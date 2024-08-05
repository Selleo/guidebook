import { first, isEmpty } from "lodash-es";
import pluralize from "pluralize";

interface DropZoneContentProps {
  files: File[];
  multiple?: boolean;
}

export default function DropzoneContent({
  files,
  multiple,
}: DropZoneContentProps) {
  if (!multiple && !isEmpty(files) && first(files)?.type.startsWith("image/")) {
    return (
      <img
        src={URL.createObjectURL(files[0])}
        alt="Preview"
        className="w-full h-full rounded-lg object-cover"
      />
    );
  }
  return (
    <span className="text-center">
      Drag and drop or click to upload {pluralize("file", multiple ? 2 : 1)}
    </span>
  );
}
