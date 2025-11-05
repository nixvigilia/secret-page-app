"use client";

import {useActionState, useEffect, useState, startTransition} from "react";
import {updateSecretMessage, type ActionResult} from "@/app/actions/secret";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {Save} from "lucide-react";

interface SecretMessageFormProps {
  initialMessage?: string;
}

export function SecretMessageForm({
  initialMessage = "",
}: SecretMessageFormProps) {
  const [message, setMessage] = useState(initialMessage);
  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(updateSecretMessage, null);

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Your Secret Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Enter your secret message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={isPending}
          rows={6}
          className="resize-none"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground">
          {message.length}/1000 characters
        </p>
      </div>
      <Button type="submit" disabled={isPending || !message.trim()}>
        <Save className="mr-2 h-4 w-4" />
        {isPending
          ? "Saving..."
          : initialMessage
            ? "Update Message"
            : "Save Message"}
      </Button>
    </form>
  );
}
