import { cn } from "@/lib/utils";
import { WhatsPortalMark } from "./whatsportal-mark";

/**
 * An uploaded image if there is one, the WhatsPortal mark otherwise.
 *
 * Uploads arrive as data URLs, which `next/image` would only add indirection
 * around — they're already inline, already sized by the caller, and never hit
 * the network.
 */
export function BrandGlyph({ src, className, markClassName, sparkleClassName }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={cn("size-full object-cover", className)}
      />
    );
  }

  return (
    <WhatsPortalMark
      className={markClassName}
      sparkleClassName={sparkleClassName}
    />
  );
}
