import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-primary-600 to-plum-700 text-white shadow-lift hover:shadow-glow hover:brightness-110",
        secondary:
          "bg-white text-primary-700 ring-1 ring-primary-200 shadow-soft hover:ring-primary-400 hover:shadow-lift",
        ghost: "text-primary-700 hover:bg-primary-50",
        outline:
          "border border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-500",
        whatsapp:
          "bg-[#25D366] text-white shadow-lift hover:brightness-105 hover:shadow-[0_0_36px_-6px_rgb(37_211_102/0.5)]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
