"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {createClient} from "@/utils/supabase/server";
import {prisma} from "@/lib/prisma";

const sendFriendRequestSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export type ActionResult = {
  success: boolean;
  message: string;
};

export async function sendFriendRequest(userId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const result = sendFriendRequestSchema.safeParse({userId});

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    // Find the receiver
    const receiver = await prisma.profile.findUnique({
      where: {id: result.data.userId},
    });

    if (!receiver) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (receiver.id === user.id) {
      return {
        success: false,
        message: "You cannot add yourself as a friend",
      };
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requester_id: user.id,
            receiver_id: receiver.id,
          },
          {
            requester_id: receiver.id,
            receiver_id: user.id,
          },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return {
          success: false,
          message: "You are already friends with this user",
        };
      }
      if (existingFriendship.status === "pending") {
        return {
          success: false,
          message: "Friend request already sent or pending",
        };
      }
    }

    // Create friend request
    await prisma.friendship.create({
      data: {
        requester_id: user.id,
        receiver_id: receiver.id,
        status: "pending",
      },
    });

    revalidatePath("/secret-page-3");

    return {
      success: true,
      message: "Friend request sent successfully",
    };
  } catch (error) {
    console.error("Error sending friend request:", error);
    return {
      success: false,
      message: "Failed to send friend request",
    };
  }
}

export async function acceptFriendRequest(
  friendshipId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  try {
    // Check if the friendship exists and user is the receiver
    const friendship = await prisma.friendship.findUnique({
      where: {id: friendshipId},
    });

    if (!friendship) {
      return {
        success: false,
        message: "Friend request not found",
      };
    }

    if (friendship.receiver_id !== user.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (friendship.status !== "pending") {
      return {
        success: false,
        message: "Friend request is not pending",
      };
    }

    // Accept the friend request
    await prisma.friendship.update({
      where: {id: friendshipId},
      data: {
        status: "accepted",
      },
    });

    revalidatePath("/secret-page-3");

    return {
      success: true,
      message: "Friend request accepted",
    };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return {
      success: false,
      message: "Failed to accept friend request",
    };
  }
}

export async function getFriendSecretMessage(
  friendId: string
): Promise<{success: boolean; message?: string; error?: string}> {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    // Check if users are friends
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requester_id: user.id,
            receiver_id: friendId,
            status: "accepted",
          },
          {
            requester_id: friendId,
            receiver_id: user.id,
            status: "accepted",
          },
        ],
      },
    });

    if (!friendship) {
      return {
        success: false,
        error: "Unauthorized - You are not friends with this user",
      };
    }

    // Get friend's secret message
    const friendProfile = await prisma.profile.findUnique({
      where: {id: friendId},
      select: {
        secret_message: true,
        email: true,
        full_name: true,
      },
    });

    if (!friendProfile) {
      return {
        success: false,
        error: "Friend not found",
      };
    }

    return {
      success: true,
      message:
        friendProfile.secret_message ||
        "This user has not set a secret message yet.",
    };
  } catch (error) {
    console.error("Error getting friend secret message:", error);
    return {
      success: false,
      error: "Failed to get friend's secret message",
    };
  }
}
