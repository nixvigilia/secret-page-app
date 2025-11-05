"use client";

import {useActionState, useEffect} from "react";
import Link from "next/link";
import {login, type ActionResult} from "../../actions/auth";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/password-input";
import {Label} from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {toast} from "sonner";

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState<
    ActionResult | null,
    FormData
  >(login, null);

  useEffect(() => {
    if (loginState) {
      if (loginState.success) {
        toast.success("Successfully signed in!");
      } else {
        toast.error(loginState.message);
      }
    }
  }, [loginState]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <form action={loginAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loginPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                required
                disabled={loginPending}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full" disabled={loginPending}>
              {loginPending ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
