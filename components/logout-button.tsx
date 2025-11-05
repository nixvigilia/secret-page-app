"use client";

import {useTransition} from "react";
import {logout} from "@/app/actions/auth";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {toast} from "sonner";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      toast.success("Successfully signed out");
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
      className="flex-1"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
