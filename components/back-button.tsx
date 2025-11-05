"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

export function BackButton({href = "/"}: {href?: string}) {
  return (
    <Link href={href}>
      <Button variant="ghost" size="icon" aria-label="Go back">
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </Link>
  );
}

