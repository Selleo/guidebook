import { cva, type VariantProps } from "class-variance-authority";
import { isEmpty, join } from "lodash-es";
import { useCallback, useMemo, useRef, useState } from "react";
import DropzoneContent from "./DropZoneContent";
import FileList from "./FileList";

type FileExtension = `.${string}`;
type MimeType = `${string}/${string}`;

type AcceptedFileType =
  | FileExtension
  | MimeType
  | "image/*"
  | "audio/*"
  | "video/*";

interface DropzoneProps extends VariantProps<typeof dropzoneVariants> {
  /**
   * @description
   * Accepted file type string. Can be one of:
   * - A file extension starting with a dot (e.g., ".pdf", ".doc")
   * - A MIME type (e.g., "image/jpeg", "application/pdf")
   * - A wildcard MIME type (e.g., "image/*", "video/*")
   * List of accepted file types.
   * @example ["image/*", ".pdf", ".doc,.docx"]
   */
  acceptedFileTypes: AcceptedFileType[];
  /**
   * Whether to allow multiple file selection.
   * @default false
   */
  multiple?: boolean;
  /**
   * Callback function called when files are selected.
   * @param files The selected files
   */
  onFilesSelected: (files: File[]) => void;
}

const dropzoneVariants = cva(
  "border rounded-lg transition-colors flex items-center justify-center text-neutral-400 text-sm cursor-pointer",
  {
    variants: {
      size: {
        full: "w-full h-40",
        preview: "w-40 h-40",
      },
      state: {
        idle: "border",
        highlighted: "border-blue-500",
        hasFile: "border-green-500",
      },
    },
    defaultVariants: {
      size: "full",
      state: "idle",
    },
  }
);

export default function FileDropZone({
  acceptedFileTypes,
  multiple = false,
  onFilesSelected,
}: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (newFiles: File[]) => {
      if (isEmpty(newFiles)) return;

      setFiles((prevFiles) =>
        multiple ? [...prevFiles, ...newFiles] : newFiles
      );
      onFilesSelected(newFiles);
    },
    [multiple, onFilesSelected]
  );

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    setIsHighlighted(true);
  };

  const onDragLeave = () => {
    setIsHighlighted(false);
  };

  const onDrop = useCallback(
    (evt: React.DragEvent<HTMLDivElement>) => {
      evt.preventDefault();
      const droppedFiles = Array.from(evt.dataTransfer.files);
      handleFileUpload(droppedFiles);
      setIsHighlighted(false);
    },
    [handleFileUpload]
  );

  const onFileChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(evt.target.files || []);
      handleFileUpload(selectedFiles);
    },
    [handleFileUpload]
  );

  const handleRemoveFile = useCallback(
    (indexToRemove: number) => {
      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter(
          (_, index) => index !== indexToRemove
        );
        onFilesSelected(updatedFiles);
        return updatedFiles;
      });
    },
    [onFilesSelected]
  );

  const getDropZoneState = useMemo(
    () =>
      (
        isHighlighted: boolean,
        hasFiles: boolean
      ): "highlighted" | "hasFile" | "idle" => {
        if (isHighlighted) return "highlighted";
        if (!multiple && hasFiles) return "hasFile";
        return "idle";
      },
    [multiple]
  );

  const dropZoneClasses = useMemo(() => {
    const size = !multiple && !isEmpty(files) ? "preview" : "full";
    const state = getDropZoneState(isHighlighted, !isEmpty(files));

    return dropzoneVariants({ size, state });
  }, [multiple, files, getDropZoneState, isHighlighted]);

  return (
    <div className="w-full space-y-4">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openFileDialog()}
        onClick={openFileDialog}
        className={dropZoneClasses}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <DropzoneContent files={files} multiple={multiple} />
      </div>
      <input
        type="file"
        onChange={onFileChange}
        ref={fileInputRef}
        className="hidden"
        accept={join(acceptedFileTypes, ",")}
        multiple={multiple}
      />
      <FileList files={files} onRemoveFile={handleRemoveFile} />
    </div>
  );
}
