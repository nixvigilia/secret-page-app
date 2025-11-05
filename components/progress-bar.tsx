"use client";

import NextTopLoader from "nextjs-toploader";

export function ProgressBar() {
  return (
    <NextTopLoader
      color="hsl(var(--primary))"
      height={2}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
    />
  );
}
