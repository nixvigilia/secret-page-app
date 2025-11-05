"use client";

import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {toast} from "sonner";
import {Eye, Lock} from "lucide-react";

interface Friend {
  id: string;
  email: string;
  full_name: string;
}

interface FriendsListProps {
  friends: Friend[];
}

export function FriendsList({friends}: FriendsListProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [secretMessage, setSecretMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleViewMessage = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsOpen(true);
    setSecretMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/friends/${friend.id}/message`);

        if (response.status === 401) {
          toast.error("Unauthorized - You are not friends with this user");
          setIsOpen(false);
          return;
        }

        if (!response.ok) {
          const data = await response.json();
          toast.error(data.error || "Failed to load message");
          setIsOpen(false);
          return;
        }

        const data = await response.json();
        setSecretMessage(data.message || "No message");
      } catch (error) {
        toast.error("Failed to load message");
        setIsOpen(false);
      }
    });
  };

  if (friends.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You don&apos;t have any friends yet. Add friends to view their secret
        messages!
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
          >
            <div>
              <p className="font-medium">{friend.full_name}</p>
              <p className="text-sm text-muted-foreground">{friend.email}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewMessage(friend)}
              disabled={isPending}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Message
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {selectedFriend?.full_name}&apos;s Secret Message
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedFriend?.email}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : secretMessage ? (
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-lg">{secretMessage}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No message available
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
