"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Should be a valid email").min(2).max(50),
  password: z.string().min(8),
});

const SignInAuth = () => {
  const router = useRouter();
  const {
    mutateAsync: login,
    isPending: isLoginPending,
    isSuccess: isLoginSuccess,
    isError: isLoginError,
    error,
  } = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;

    try {
      await login({ email, password });
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoginSuccess) {
      toast({
        description: "Logged in.",
      });
      router.push("/");
    } else if (isLoginError) {
      console.log("Login failed:", error);
      setError("root", { message: error.message });
    }
  }, [isLoginError, isLoginSuccess, error]);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Sign In as Vendor</CardTitle>
          <CardDescription>
            Enter your login credentials. Click Sign In when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-[14px]">
                {errors?.email?.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input {...register("password")} id="password" type="password" />
            {errors.password && (
              <p className="text-red-500 text-[14px]">
                {errors?.password?.message}
              </p>
            )}
          </div>
          {errors.root && <p className="text-red-500 text-[14px]">{errors.root.message}</p>}
        </CardContent>
        <CardFooter>
          <Button
            disabled={isLoginPending || isSubmitting}
            className="w-full tracking-wide"
          >
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignInAuth;
