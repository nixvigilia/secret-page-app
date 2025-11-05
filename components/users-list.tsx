"use client";

import {useState, useTransition} from "react";
import {sendFriendRequest} from "@/app/actions/friends";
import {Button} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {toast} from "sonner";
import {UserPlus, Check, Eye, Lock} from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

interface UsersListProps {
  users: User[];
  friendsIds: string[];
  pendingRequestIds: string[];
  sentRequestIds: string[];
}

export function UsersList({
  users,
  friendsIds,
  pendingRequestIds,
  sentRequestIds,
}: UsersListProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [secretMessage, setSecretMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const handleSendRequest = (userId: string) => {
    startTransition(async () => {
      const result = await sendFriendRequest(userId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleViewMessage = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
    setSecretMessage(null);
    setIsLoadingMessage(true);

    // Try to fetch message - this will return 401 if not friends
    fetch(`/api/friends/${user.id}/message`)
      .then(async (response) => {
        setIsLoadingMessage(false);

        if (response.status === 401) {
          const data = await response.json();
          setSecretMessage(null);
          toast.error(
            data.error || "Unauthorized - You are not friends with this user"
          );
          return;
        }

        if (!response.ok) {
          const data = await response.json();
          toast.error(data.error || "Failed to load message");
          return;
        }

        const data = await response.json();
        setSecretMessage(data.message || "No message");
      })
      .catch(() => {
        setIsLoadingMessage(false);
        toast.error("Failed to load message");
      });
  };

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No other users found</p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {users.map((user) => {
          const isFriend = friendsIds.includes(user.id);
          const hasPendingRequest = pendingRequestIds.includes(user.id);
          const hasSentRequest = sentRequestIds.includes(user.id);

          return (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
            >
              <div>
                <p className="font-medium">{user.full_name || user.email}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2">
                {!isFriend && !hasSentRequest && !hasPendingRequest && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewMessage(user)}
                    disabled={isLoadingMessage}
                    title="Try to view message (will show 401 if not friends)"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Try View
                  </Button>
                )}
                {isFriend ? (
                  <Button size="sm" variant="outline" disabled>
                    <Check className="mr-2 h-4 w-4" />
                    Friend
                  </Button>
                ) : hasSentRequest ? (
                  <Button size="sm" variant="outline" disabled>
                    Request Sent
                  </Button>
                ) : hasPendingRequest ? (
                  <Button size="sm" variant="outline" disabled>
                    Pending
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(user.id)}
                    disabled={isPending}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Friend
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {selectedUser?.full_name || selectedUser?.email}&apos;s Secret
              Message
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.email}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {isLoadingMessage ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : secretMessage ? (
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-lg">{secretMessage}</p>
              </div>
            ) : (
              <div className="rounded-lg border p-4 bg-destructive/10">
                <p className="text-sm font-medium text-destructive">
                  401 Unauthorized
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  You are not friends with this user. You must be friends to
                  view their secret message.
                </p>
              </div>
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
