import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border-3 border-black text-sm font-bold whitespace-nowrap transition-all outline-none select-none shadow-[3px_3px_0px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000] focus-visible:outline-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-black hover:bg-primary",
        outline:
          "bg-card text-foreground hover:bg-card",
        secondary:
          "bg-secondary text-white hover:bg-secondary",
        ghost:
          "border-transparent shadow-none hover:bg-foreground/5 hover:-translate-x-0 hover:-translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0 active:shadow-none",
        destructive:
          "bg-destructive text-white hover:bg-destructive",
        link: "border-transparent shadow-none bg-transparent text-foreground hover:underline hover:-translate-x-0 hover:-translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0 active:shadow-none",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3.5",
        xs: "h-6.5 gap-1 rounded-md px-2 text-xs",
        sm: "h-8 gap-1 rounded-lg px-2.5 text-xs",
        lg: "h-10 gap-1.5 px-4 text-base",
        icon: "size-9",
        "icon-xs":
          "size-6.5 rounded-md",
        "icon-sm":
          "size-8 rounded-lg",
        "icon-lg": "size-10",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
