"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface InSupLockupProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  alt?: string;
}

export function InSupLockup({
  className,
  imageClassName,
  priority = false,
  alt = "InSup",
}: InSupLockupProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/insup-lockup.png"
        alt={alt}
        width={980}
        height={360}
        className={cn("h-10 w-auto object-contain", imageClassName)}
        priority={priority}
      />
    </span>
  );
}
