import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-base font-semibold transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-imrc-accent text-imrc-primary px-[32px] py-[14px] shadow-btn hover:bg-imrc-accent-light hover:-translate-y-[3px] hover:shadow-btn-hover": variant === "primary",
            "bg-transparent border-2 border-imrc-secondary text-imrc-secondary px-[32px] py-[14px] hover:bg-imrc-secondary hover:text-imrc-bg hover:-translate-y-[3px]": variant === "secondary",
            "bg-transparent text-imrc-primary px-4 py-2 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-1 after:left-0 after:bg-imrc-accent after:origin-left after:transition-transform after:duration-300 hover:text-imrc-accent hover:after:scale-x-100": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
