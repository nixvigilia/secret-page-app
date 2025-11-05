"use client";

import NextTopLoader from "nextjs-toploader";

export function ProgressBar() {
  return (
    <NextTopLoader
      color="hsl(0 0% 20.5%)"
      height={2}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px hsl(0 0% 20.5%),0 0 5px hsl(0 0% 20.5%)"
      zIndex={1600}
    />
  );
}
