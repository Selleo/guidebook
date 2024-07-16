import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useLoginUser } from "~/api/mutations/useLoginUser";
import { useForm } from "react-hook-form";
import { LoginBody } from "~/api/generated-api";
import { cn } from "~/lib/utils";

export default function LoginPage() {
  const { mutate: loginUser } = useLoginUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginBody>();

  const onSubmit = async (data: LoginBody) => {
    loginUser({ data });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className={cn({ "border-red-500": errors.email })}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">Email is required</div>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              className={cn({ "border-red-500": errors.password })}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <div className="text-red-500 text-sm">Password is required</div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
