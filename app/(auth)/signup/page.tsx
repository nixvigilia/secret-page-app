"use client";

import {useActionState, useEffect, useState, startTransition} from "react";
import Link from "next/link";
import {signup, type ActionResult} from "../../actions/auth";
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
import {PasswordStrengthIndicator} from "@/components/password-strength-indicator";
import {checkPasswordStrength} from "@/lib/password-strength";

export default function SignupPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupState, signupAction, signupPending] = useActionState<
    ActionResult | null,
    FormData
  >(signup, null);

  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const passwordStrength = checkPasswordStrength(password);
  const isFormValid = passwordStrength.isValid && passwordsMatch;

  useEffect(() => {
    if (signupState) {
      if (signupState.success) {
        toast.success(signupState.message);
      } else {
        toast.error(signupState.message);
      }
    }
  }, [signupState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const passwordValue = formData.get("password") as string;
    const confirmPasswordValue = formData.get("confirmPassword") as string;

    if (passwordValue !== confirmPasswordValue) {
      toast.error("Passwords do not match.");
      return;
    }

    const strength = checkPasswordStrength(passwordValue);
    if (!strength.isValid) {
      toast.error("Password is too weak. Please strengthen it.");
      return;
    }

    startTransition(() => {
      signupAction(formData);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your information to create a new account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={signupPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={signupPending}
              />
              <PasswordStrengthIndicator password={password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={signupPending}
                aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive">
                  Passwords do not match
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={signupPending || !isFormValid}
            >
              {signupPending ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
