"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {z} from "zod";

import {createClient} from "@/utils/supabase/server";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type ActionResult = {
  success: boolean;
  message: string;
};

export async function login(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Invalid input",
    };
  }

  const data = result.data;

  const {error} = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to sign in",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = signupSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Invalid input",
    };
  }

  const data = result.data;

  const {error} = await supabase.auth.signUp(data);

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to sign up",
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Check your email to confirm your account",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function deleteAccount(): Promise<ActionResult> {
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

  // Delete profile which will trigger the database function to delete auth user
  const {prisma} = await import("@/lib/prisma");
  try {
    await prisma.profile.delete({
      where: {id: user.id},
    });

    // Sign out after deletion
    await supabase.auth.signOut();
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Account successfully deleted",
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      message: "Failed to delete account",
    };
  }
}
