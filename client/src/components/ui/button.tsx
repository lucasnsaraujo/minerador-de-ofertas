import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2F52] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#8B2F52] to-[#6B1B3D] text-white shadow-md hover:shadow-lg hover:shadow-[#8B2F52]/40 hover:brightness-110",
        secondary:
          "bg-gradient-to-r from-[#D4A574] to-[#C8915F] text-[#2D2424] shadow-md hover:shadow-lg hover:shadow-[#D4A574]/40 hover:brightness-110",
        accent:
          "bg-gradient-to-r from-[#5C7457] to-[#8FA88E] text-white shadow-md hover:shadow-lg hover:shadow-[#5C7457]/40 hover:brightness-110",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:shadow-lg hover:shadow-red-600/40 hover:brightness-110",
        outline:
          "border-2 border-[#8B2F52]/30 dark:border-[#B85478]/30 bg-transparent hover:bg-[#8B2F52]/5 dark:hover:bg-[#B85478]/5 hover:border-[#8B2F52] dark:hover:border-[#B85478] text-[#8B2F52] dark:text-[#B85478]",
        ghost:
          "hover:bg-[#8B2F52]/10 dark:hover:bg-[#B85478]/10 text-[#8B2F52] dark:text-[#B85478]",
        link:
          "text-[#8B2F52] dark:text-[#B85478] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
