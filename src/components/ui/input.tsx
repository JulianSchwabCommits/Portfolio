import * as React from "react"

import { cn } from "@/lib/utils"
import { DESIGN_TOKENS } from "@/design-tokens"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full ${DESIGN_TOKENS.BORDER_RADIUS.FORM_ELEMENT} border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none ${DESIGN_TOKENS.STATES.FOCUS_RING} focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed ${DESIGN_TOKENS.OPACITY.DISABLED} md:text-sm`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
