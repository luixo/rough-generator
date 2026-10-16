import type React from "react";

import { Slot } from "@radix-ui/react-slot";
import { twMerge } from "tailwind-merge";

const variants = {
	default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
	destructive:
		"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
	ghost: "hover:bg-accent hover:text-accent-foreground",
	link: "text-primary underline-offset-4 hover:underline",
	outline:
		"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
	secondary:
		"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
};
const sizes = {
	default: "h-9 px-4 py-2",
	icon: "size-9",
	lg: "h-10 rounded-md px-8",
	sm: "h-8 rounded-md px-3 text-xs",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: keyof typeof variants;
	size?: keyof typeof sizes;
	asChild?: boolean;
};

export const getButtonClassname = (
	{
		size = "default",
		variant = "default",
	}: Pick<ButtonProps, "size" | "variant"> = {},
	className?: string,
) =>
	twMerge(
		"focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
		sizes[size],
		variants[variant],
		className,
	);

export const Button: React.FC<ButtonProps> = ({
	className,
	variant,
	size,
	asChild = false,
	...props
}) => {
	const Comp = asChild ? Slot : "button";
	return (
		<Comp
			className={getButtonClassname({ size, variant }, className)}
			{...props}
		/>
	);
};
