import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border-2 border-black px-2 py-0.5 text-[11px] font-black uppercase tracking-wider transition-colors focus:outline-none select-none shadow-[2px_2px_0px_0px_#000]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black",
        secondary:
          "bg-secondary text-white",
        destructive:
          "bg-destructive text-white",
        outline: "bg-card text-foreground",
        flat: "bg-accent text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
