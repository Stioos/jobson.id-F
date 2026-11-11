"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface WebuosLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WebuosLogo({ size = "md", className }: WebuosLogoProps) {
  const heightCls =
    size === "sm" ? "h-7 w-auto" : size === "lg" ? "h-10 w-auto" : "h-8 w-auto";

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/jobsonn-logo.png"
        alt="JOBSONN"
        width={128}
        height={36}
        className={cn(heightCls, "object-contain")}
        priority
      />
    </span>
  );
}
