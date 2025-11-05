import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";
import {prisma} from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {LogoutButton} from "@/components/logout-button";
import {DeleteAccountButton} from "@/components/delete-account-button";
import {BackButton} from "@/components/back-button";
import {SecretMessageForm} from "@/components/secret-message-form";
import {FriendsList} from "@/components/friends-list";
import {PendingRequests} from "@/components/pending-requests";
import {UsersList} from "@/components/users-list";
import {Lock, Users} from "lucide-react";

export default async function SecretPage3() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const profile = await prisma.profile.findUnique({
    where: {id: user.id},
  });

  const secretMessage = profile?.secret_message || "";

  // Get friends (accepted friendships)
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        {requester_id: user.id, status: "accepted"},
        {receiver_id: user.id, status: "accepted"},
      ],
    },
    include: {
      requester: {
        select: {
          id: true,
          email: true,
          full_name: true,
        },
      },
      receiver: {
        select: {
          id: true,
          email: true,
          full_name: true,
        },
      },
    },
  });

  // Get pending friend requests (where current user is receiver)
  const pendingRequests = await prisma.friendship.findMany({
    where: {
      receiver_id: user.id,
      status: "pending",
    },
    include: {
      requester: {
        select: {
          id: true,
          email: true,
          full_name: true,
        },
      },
    },
  });

  // Get sent friend requests (where current user is requester)
  const sentRequests = await prisma.friendship.findMany({
    where: {
      requester_id: user.id,
      status: "pending",
    },
    select: {
      receiver_id: true,
    },
  });

  // Format friends list
  const friends = friendships.map((friendship) => {
    const friend =
      friendship.requester_id === user.id
        ? friendship.receiver
        : friendship.requester;
    return {
      id: friend.id,
      email: friend.email,
      full_name: friend.full_name || friend.email,
    };
  });

  // Get all users (excluding current user)
  const allUsers = await prisma.profile.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: {
      id: true,
      email: true,
      full_name: true,
    },
    orderBy: {
      full_name: "asc",
    },
  });

  // Get IDs for filtering
  const friendsIds = friends.map((f) => f.id);
  const pendingRequestIds = pendingRequests.map((r) => r.requester.id);
  const sentRequestIds = sentRequests.map((r) => r.receiver_id);

  // Filter out users who are already friends or have pending requests
  const availableUsers = allUsers.filter(
    (u) =>
      !friendsIds.includes(u.id) &&
      !pendingRequestIds.includes(u.id) &&
      !sentRequestIds.includes(u.id)
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <BackButton />
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Lock className="h-8 w-8" />
              Secret Page 3
            </CardTitle>
          </div>
          <CardDescription>
            Manage your friends and view their secret messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Secret Message Form (from secret-page-2) */}
          <div className="rounded-lg border p-6 bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Your Secret Message
            </h3>
            <SecretMessageForm initialMessage={secretMessage} />
          </div>

          {/* Users List */}
          <div className="rounded-lg border p-6 bg-background">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Users ({availableUsers.length})
            </h3>
            <UsersList
              users={availableUsers}
              friendsIds={friendsIds}
              pendingRequestIds={pendingRequestIds}
              sentRequestIds={sentRequestIds}
            />
          </div>

          {/* Pending Friend Requests */}
          {pendingRequests.length > 0 && (
            <div className="rounded-lg border p-6 bg-background">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Pending Friend Requests
              </h3>
              <PendingRequests requests={pendingRequests} />
            </div>
          )}

          {/* Friends List */}
          <div className="rounded-lg border p-6 bg-background">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Your Friends ({friends.length})
            </h3>
            <FriendsList friends={friends} />
          </div>

          {/* Logout and Delete Account */}
          <div className="flex gap-2 pt-4 border-t">
            <LogoutButton />
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
