"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
	children: ReactNode;
	className?: string;
}

export default function Button({ variant = "primary", size = "md", children, className, ...props }: ButtonProps) {
	const baseStyles =
		"font-body font-semibold uppercase tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

	const variants = {
		primary: "bg-accent-500 text-primary-600 hover:bg-accent-600 hover:shadow-lg",
		secondary: "bg-transparent border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-primary-600",
		ghost: "bg-transparent text-neutral-50 hover:text-accent-500 border-2 border-transparent hover:border-accent-500",
	};

	const sizes = {
		sm: "px-4 py-2 text-xs",
		md: "px-6 py-3 text-sm",
		lg: "px-8 py-4 text-base",
	};

	return (
		<button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
			{children}
		</button>
	);
}

// Utility function para combinar classNames (necesaria para shadcn/ui)
// Si ya existe en tu proyecto, puedes borrar esta función
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ");
}
