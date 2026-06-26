import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("border-2 border-dashed border-black bg-muted/60 animate-pulse rounded-lg", className)}
      {...props}
    />
  )
}

export { Skeleton }
