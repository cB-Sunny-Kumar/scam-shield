import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-white/10 bg-transparent hover:bg-white/5 hover:text-white",
                secondary:
                    "bg-white/5 text-foreground hover:bg-white/10 border border-white/5",
                ghost: "hover:bg-white/5 hover:text-primary",
                link: "text-primary underline-offset-4 hover:underline",
                neon: "bg-primary text-white border border-primary/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] animate-pulse-cyan",
                safe: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
                danger: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-9 rounded-lg px-3 text-xs",
                lg: "h-14 rounded-2xl px-10 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)


export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
