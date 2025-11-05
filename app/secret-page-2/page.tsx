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
import {Lock, Edit} from "lucide-react";

export default async function SecretPage2() {
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

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <BackButton />
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Lock className="h-8 w-8" />
              Secret Page 2
            </CardTitle>
          </div>
          <CardDescription>
            Add or edit your secret message below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-6 bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Secret Message
            </h3>
            <SecretMessageForm initialMessage={secretMessage} />
          </div>
          {secretMessage && (
            <div className="rounded-lg border p-6 bg-background">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Current Secret Message
              </h3>
              <p className="text-lg">{secretMessage}</p>
            </div>
          )}
          <div className="flex gap-2 pt-4 border-t">
            <LogoutButton />
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
