import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { getNewsImageUrl } from "@/lib/newsImage";

interface NewsImageProps {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
}

export function NewsImage({
  src,
  alt,
  sizes,
  className,
  priority,
  unoptimized,
}: NewsImageProps) {
  if (!src?.trim()) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#FBFCFE]"
      >
        <span
          aria-hidden="true"
          className="absolute -right-12 -bottom-16 h-40 w-40 rounded-full border-[28px] border-white/45"
        />
        <span className="relative flex items-center justify-center text-[#F85308]">
          <ImageIcon className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
        </span>
      </div>
    );
  }

  return (
    <Image
      src={getNewsImageUrl(src)}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
    />
  );
}
