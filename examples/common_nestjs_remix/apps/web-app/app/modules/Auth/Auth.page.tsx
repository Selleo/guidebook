import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginUser } from "~/api/mutations/useLoginUser";
import { useRegisterUser } from "~/api/mutations/useRegisterUser";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { authClient } from "./auth.client";
import { useLoginGoogle } from "~/api/mutations/useLoginGoogle";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

export async function clientLoader() {
  const session = await authClient.getSession();

  if (session?.data) {
    throw redirect("/dashboard");
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync: loginUser } = useLoginUser();
  const { mutateAsync: loginGoogle } = useLoginGoogle();
  const { mutateAsync: registerUser } = useRegisterUser();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [searchParams] = useSearchParams();

  const verified = searchParams.get("verified");

  const resolver = React.useMemo(
    () => zodResolver(isSignUp ? registerSchema : loginSchema),
    [isSignUp]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver });

  const onSubmit = (data: LoginFormValues) => {
    if (isSignUp) {
      registerUser({
        data: {
          email: data.email,
          password: data.password,
          name: data.name ?? "",
        },
      });
    } else {
      loginUser({ data: { email: data.email, password: data.password } }).then(
        () => {
          navigate("/dashboard");
        }
      );
    }
  };

  useEffect(() => {
    if (verified === "true") {
      toast("Your email has been verified", {
        description: "You can now log in to your account",
        position: "top-center",
      });
      navigate("/auth", {
        replace: true,
      });
    }
  }, [verified, navigate]);

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  {isSignUp ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {isSignUp
                    ? "Enter your details to get started"
                    : "Login to your Guidebook account"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className={cn({ "border-red-500": errors.email })}
                    {...register("email")}
                    required
                  />
                  {errors.email?.message && (
                    <p className="mt-0.5 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              {isSignUp && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Username</Label>
                  <div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="your_username"
                      className={cn({ "border-red-500": errors.name })}
                      {...register("name")}
                      required={isSignUp}
                    />
                    {errors.name?.message && (
                      <p className="mt-0.5 text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div>
                  <Input
                    id="password"
                    type="password"
                    className={cn({ "border-red-500": errors.password })}
                    {...register("password")}
                    required
                  />
                  {errors.password?.message && (
                    <p className="mt-0.5 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              {isSignUp && (
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className={cn({
                        "border-red-500": errors.confirmPassword,
                      })}
                      {...register("confirmPassword")}
                      required={isSignUp}
                    />
                    {errors.confirmPassword?.message && (
                      <p className="mt-0.5 text-xs text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full">
                {isSignUp ? "Create account" : "Login"}
              </Button>
              <a
                href="#"
                className="text-center text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    loginGoogle();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  {/* Microsoft logo: four squares */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <rect
                      x="1"
                      y="1"
                      width="10"
                      height="10"
                      fill="currentColor"
                    />
                    <rect
                      x="13"
                      y="1"
                      width="10"
                      height="10"
                      fill="currentColor"
                    />
                    <rect
                      x="1"
                      y="13"
                      width="10"
                      height="10"
                      fill="currentColor"
                    />
                    <rect
                      x="13"
                      y="13"
                      width="10"
                      height="10"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Microsoft</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="underline underline-offset-4"
                      onClick={() => setIsSignUp(false)}
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      className="underline underline-offset-4"
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/prezes.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
