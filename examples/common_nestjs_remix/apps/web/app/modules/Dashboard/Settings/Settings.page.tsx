import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ChangePasswordForm from "./forms/ChangePasswordForm";
import UserForm from "./forms/UserForm";
import FileDropZone from "~/components/FileDropZone/FileDropZone";
import { Button } from "~/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <Card id="user-avatar">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Update your avatar by dragging and dropping a file here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <FileDropZone />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <UserForm />
      <ChangePasswordForm />
    </div>
  );
}
