"use client";

import {useTransition} from "react";
import {acceptFriendRequest} from "@/app/actions/friends";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Check, X} from "lucide-react";

interface PendingRequest {
  id: string;
  requester: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

interface PendingRequestsProps {
  requests: PendingRequest[];
}

export function PendingRequests({requests}: PendingRequestsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = (friendshipId: string) => {
    startTransition(async () => {
      const result = await acceptFriendRequest(friendshipId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No pending friend requests
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
        >
          <div>
            <p className="font-medium">
              {request.requester.full_name || request.requester.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {request.requester.email}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => handleAccept(request.id)}
            disabled={isPending}
          >
            <Check className="mr-2 h-4 w-4" />
            Accept
          </Button>
        </div>
      ))}
    </div>
  );
}

