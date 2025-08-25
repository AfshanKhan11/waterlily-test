import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "outlined" | "glass";
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hoverable = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl p-6 transition-all duration-300",
          "overflow-hidden", // for gradient/glass effects
          // Variants
          variant === "default" &&
            "bg-white shadow-md border border-gray-100",
          variant === "gradient" &&
            "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg",
          variant === "outlined" &&
            "bg-white border border-transparent shadow-sm " +
            "bg-clip-padding [background:linear-gradient(white,white),linear-gradient(to_right,rgba(168,85,247,0.6),rgba(236,72,153,0.6))] [background-origin:border-box] [background-clip:content-box,border-box]",
          variant === "glass" &&
            "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg",
          // Hover effect
          hoverable && "hover:shadow-xl ",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
