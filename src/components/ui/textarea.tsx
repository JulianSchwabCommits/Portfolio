import * as React from "react"

import { cn } from "@/lib/utils"
import { DESIGN_TOKENS } from "@/design-tokens"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `flex min-h-[80px] w-full ${DESIGN_TOKENS.BORDER_RADIUS.FORM_ELEMENT} border border-input bg-background px-3 py-2 ${DESIGN_TOKENS.TYPOGRAPHY.BODY_SMALL} ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none ${DESIGN_TOKENS.STATES.FOCUS_RING} focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed ${DESIGN_TOKENS.OPACITY.DISABLED}`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
