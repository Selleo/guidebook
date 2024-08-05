import ChangePasswordForm from "./forms/ChangePasswordForm";
import UserAvatar from "./forms/UserAvatar";
import UserForm from "./forms/UserForm";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <UserAvatar />
      <UserForm />
      <ChangePasswordForm />
    </div>
  );
}
