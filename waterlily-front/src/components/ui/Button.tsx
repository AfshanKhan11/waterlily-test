import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"|"ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  disabled?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background overflow-hidden group",
          // Variants
          variant === "primary" &&
            "bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-purple-400/50 focus:ring-purple-500",
          variant === "secondary" &&
            "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white shadow-md hover:shadow-gray-400/40 focus:ring-gray-500",
          variant === "outline" &&
            "border border-purple-400 text-purple-600 hover:bg-purple-50 focus:ring-purple-400",
          variant === "ghost" &&
            "bg-transparent text-purple-600 border border-purple-400 shadow-md hover:bg-purple-50 focus:ring-purple-400",

            // Sizes
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shine Effect Layer */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out"></span>

        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white relative z-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                 5.291A7.962 7.962 0 014 12H0c0 3.042 
                 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <span className="relative z-10">{props.children}</span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
