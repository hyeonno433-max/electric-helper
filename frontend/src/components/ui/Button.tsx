import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            primary: "bg-neon-green text-deep-navy hover:opacity-90 shadow-[0_0_20px_rgba(57,255,20,0.3)] border border-transparent",
            outline: "border border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-500",
            ghost: "text-gray-400 hover:text-white hover:bg-white/5"
        }

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg"
        }

        const variantStyles = variants[variant]
        const sizeStyles = sizes[size]

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
