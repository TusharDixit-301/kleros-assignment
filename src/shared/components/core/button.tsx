import { cn } from "@/shared/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "group cursor-pointer rounded-md text-base font-medium whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        cta: "bg-brand-secondary focus-within:bg-brand-secondary/80 hover:bg-brand-secondary/80 text-slate-900",
        ctaOutline:
          "bg-brand-secondary text-secondary-900 focus-within:bg-brand-secondary dark:bg-brand-secondary/30 dark:text-brand-secondary dark:hover:bg-brand-secondary/75",
        default: "bg-white text-black opacity-70 focus-within:bg-white/75 hover:bg-white/75",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border bg-transparent text-white hover:bg-gray-700",
        secondary: "bg-secondary text-secondary-foreground focus-within:bg-secondary/70 hover:bg-secondary/70",
        ghost: "focus-within:bg-accent hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 focus-within:underline hover:underline",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
