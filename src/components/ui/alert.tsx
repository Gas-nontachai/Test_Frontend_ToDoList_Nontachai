import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border px-4 py-3 text-sm shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground",
        info: "border-sky-200 bg-sky-50/90 text-sky-900",
        success: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
        warning: "border-amber-200 bg-amber-50/90 text-amber-900",
        playful: "border-pink-200 bg-pink-50/80 text-pink-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

export { Alert, alertVariants };

