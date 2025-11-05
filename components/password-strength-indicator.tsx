"use client";

import { checkPasswordStrength, getPasswordStrengthLabel } from "@/lib/password-strength";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, feedback } = checkPasswordStrength(password);
  const { label, color } = getPasswordStrengthLabel(score);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", color)}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground min-w-[60px] text-right">
          {label}
        </span>
      </div>
      {feedback.length > 0 && (
        <div className="space-y-1">
          {feedback.map((item, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              • {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

