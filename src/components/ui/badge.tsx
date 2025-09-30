import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { DESIGN_TOKENS } from "@/design-tokens"

const badgeVariants = cva(
  `inline-flex items-center ${DESIGN_TOKENS.BORDER_RADIUS.BUTTON_PILL} border px-2.5 py-0.5 ${DESIGN_TOKENS.TYPOGRAPHY.PILL_TEXT} ${DESIGN_TOKENS.ANIMATION.COLOR_TRANSITION} focus:outline-none ${DESIGN_TOKENS.STATES.FOCUS_RING} focus:ring-ring focus:ring-offset-2`,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
