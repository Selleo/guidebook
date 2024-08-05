import FileDropZone from "~/components/FileDropZone/FileDropZone";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function UserAvatar() {
  return (
    <Card id="user-avatar">
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>
          Update your avatar by dragging and dropping a file here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <FileDropZone
          acceptedFileTypes={[
            ".jpg",
            ".jpeg",
            ".png",
            ".pdf",
            ".docx",
            ".pptx",
            ".xlsx",
            ".csv",
            ".txt",
          ]}
          multiple
          onFilesSelected={function (files: File[]): void {
            console.log(files);
            // TODO: Implement file upload
          }}
        />
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}
