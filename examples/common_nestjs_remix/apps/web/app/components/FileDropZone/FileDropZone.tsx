import React, { useCallback, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { Label } from "../ui/label";

function Dropzone() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [fileName, setFileName] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setFileName(file.name);

    // TODO: Implement server-side file upload
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onDragOver = useCallback((evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    setIsHighlighted(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsHighlighted(false);
  }, []);

  const onDrop = useCallback(async (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const file = Array.from(evt.dataTransfer.files)[0];
    await handleFileUpload(file);
    setIsHighlighted(false);
  }, []);

  const onFileChange = useCallback(
    async (evt: React.ChangeEvent<HTMLInputElement>) => {
      const file = Array.from(evt.target.files || [])[0];
      await handleFileUpload(file);
    },
    []
  );

  const dropZoneClasses = cn(
    "border-neutral-500 transition-colors h-40 flex items-center justify-center text-neutral-400 text-sm cursor-pointer",
    {
      "!border-neutral-300": isHighlighted,
      "border p-2 w-full": !avatar,
      "rounded-lg w-40": avatar,
    }
  );

  return (
    <div className="flex gap-6">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={openFileDialog}
        onClick={openFileDialog}
        className={dropZoneClasses}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full rounded-lg object-cover"
          />
        ) : (
          <span className="text-center">
            Drag and drop or click to upload avatar
          </span>
        )}
        <input
          type="file"
          onChange={onFileChange}
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
        />
      </div>
      {fileName && (
        <div className="space-y-2">
          <Label htmlFor="email">File name</Label>
          <p className="cursor-default border h-fit p-2 rounded-md text-sm text-neutral-300">
            {fileName}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dropzone;
