import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { type UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, registration, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative rounded-xl transition-all",
            error ? "ring-2 ring-red-400" : "focus-within:ring-2 focus-within:ring-purple-500"
          )}
        >
          {/* Input field */}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm placeholder-gray-400",
              "bg-white focus:outline-none transition-all duration-200",
              "focus:border-purple-400 focus:ring-0",
              error &&
                "border-red-400 text-red-600 placeholder-red-300 focus:border-red-500",
              className
            )}
            {...registration}
            {...props}
          />

          {/* Glow effect on focus */}
          <span
            className={cn(
              "pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300",
              "focus-within:border-purple-400 focus-within:shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            )}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
