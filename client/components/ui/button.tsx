import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer border-none custom-button-style",
  {
    variants: {
      variant: {
        default:
          "bg-gray-800/50 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_0_5px_rgba(16,185,129,0.37)]",
        destructive:
          "bg-red-900/20 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_0_5px_rgba(239,68,68,0.37)]",
        outline:
          "bg-transparent text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_0_5px_rgba(16,185,129,0.37)] hover:border-emerald-500",
        secondary:
          "bg-gray-700/50 text-gray-300 hover:bg-gray-600 hover:text-white hover:shadow-[0_0_0_5px_rgba(107,114,128,0.37)]",
        ghost:
          "bg-transparent text-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_0_5px_rgba(16,185,129,0.37)]",
        link: "text-emerald-400 underline-offset-4 hover:underline hover:text-emerald-300",
      },
      size: {
        default: "h-11 px-6 py-2 min-w-[100px] has-[>svg]:px-5",
        sm: "h-9 rounded-md gap-1.5 px-4 min-w-[80px] has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 min-w-[120px] has-[>svg]:px-6",
        icon: "size-11 min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
