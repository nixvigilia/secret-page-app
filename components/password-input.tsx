"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Eye, EyeOff} from "lucide-react";
import {cn} from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  showToggle?: boolean;
}

export function PasswordInput({
  className,
  showToggle = true,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPassword(!showPassword);
          }}
          disabled={props.disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      )}
    </div>
  );
}
