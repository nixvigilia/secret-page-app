import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{friendId: string}>}
) {
  const {friendId} = await params;
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
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
      return NextResponse.json(
        {error: "Unauthorized - You are not friends with this user"},
        {status: 401}
      );
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
      return NextResponse.json({error: "Friend not found"}, {status: 404});
    }

    return NextResponse.json({
      message:
        friendProfile.secret_message ||
        "This user has not set a secret message yet.",
    });
  } catch (error) {
    console.error("Error getting friend secret message:", error);
    return NextResponse.json(
      {error: "Failed to get friend's secret message"},
      {status: 500}
    );
  }
}

