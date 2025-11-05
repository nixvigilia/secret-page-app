"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {createClient} from "@/utils/supabase/server";
import {prisma} from "@/lib/prisma";

const secretMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
});

export type ActionResult = {
  success: boolean;
  message: string;
};

export async function updateSecretMessage(
  _prevState: ActionResult | null,
  formData: FormData
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

  const rawData = {
    message: formData.get("message"),
  };

  const result = secretMessageSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    // Update or create profile with secret message
    await prisma.profile.upsert({
      where: {id: user.id},
      update: {
        secret_message: result.data.message,
        updated_at: new Date(),
      },
      create: {
        id: user.id,
        email: user.email || "",
        secret_message: result.data.message,
      },
    });

    revalidatePath("/secret-page-1");
    revalidatePath("/secret-page-2");
    revalidatePath("/secret-page-3");

    return {
      success: true,
      message: "Secret message updated successfully",
    };
  } catch (error) {
    console.error("Error updating secret message:", error);
    return {
      success: false,
      message: "Failed to update secret message",
    };
  }
}
