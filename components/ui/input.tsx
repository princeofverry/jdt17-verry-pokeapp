import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border-3 border-black bg-card px-3 py-2 text-sm text-foreground shadow-[3px_3px_0px_0px_#000] transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] focus-visible:shadow-[2px_2px_0px_0px_#000] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
