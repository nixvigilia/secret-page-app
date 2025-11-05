import {redirect} from "next/navigation";
import Link from "next/link";
import {createClient} from "@/utils/supabase/server";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {LogoutButton} from "@/components/logout-button";
import {DeleteAccountButton} from "@/components/delete-account-button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Welcome to Secret Page App
          </CardTitle>
          <CardDescription>
            Navigate to your secret pages or manage your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/secret-page-1">
              <Button variant="outline" className="w-full h-24 text-lg">
                Secret Page 1
              </Button>
            </Link>
            <Link href="/secret-page-2">
              <Button variant="outline" className="w-full h-24 text-lg">
                Secret Page 2
              </Button>
            </Link>
            <Link href="/secret-page-3">
              <Button variant="outline" className="w-full h-24 text-lg">
                Secret Page 3
              </Button>
            </Link>
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <LogoutButton />
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
