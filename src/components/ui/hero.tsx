
import { HTMLProps } from "react";
import { cn } from "@/lib/utils";

interface HeroProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  overlay?: boolean;
  fullHeight?: boolean;
  centered?: boolean;
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  overlay = true,
  fullHeight = false,
  centered = true,
  className,
  children,
  ...props
}: HeroProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        fullHeight ? "min-h-screen" : "min-h-[60vh]",
        className
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      {...props}
    >
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-black/40 z-0" />
      )}
      <div
        className={cn(
          "flex-1 flex flex-col relative z-10 px-4 py-12",
          centered && "justify-center items-center text-center"
        )}
      >
        {title && (
          <h1
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
              backgroundImage && "text-white"
            )}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            className={cn(
              "mt-4 text-xl md:text-2xl max-w-3xl",
              backgroundImage && "text-white/90"
            )}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
