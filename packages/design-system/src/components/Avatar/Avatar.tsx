import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const avatarVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  name: string;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

export function Avatar({ src, name, size, className }: AvatarProps) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const hue = getHue(name);
  const bg = `oklch(88% 0.09 ${hue})`;
  const fg = `oklch(32% 0.12 ${hue})`;

  return (
    <span
      className={cn(avatarVariants({ size }), className)}
      style={!src || imgFailed ? { backgroundColor: bg, color: fg } : undefined}
      aria-label={name}
    >
      {src && !imgFailed ? (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span aria-hidden>{getInitials(name)}</span>
      )}
    </span>
  );
}

export { avatarVariants };
export type { AvatarProps };
