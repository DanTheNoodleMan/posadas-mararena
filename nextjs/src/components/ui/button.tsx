"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
	children: ReactNode;
	className?: string;
	href?: string;
	external?: boolean;
}

export default function Button({ variant = "primary", size = "md", children, className, href, external = false, ...props }: ButtonProps) {
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

	const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

	// Si tiene href, renderizar como Link
	if (href) {
		if (external) {
			return (
				<a href={href} target="_blank" rel="noopener noreferrer" className={combinedClassName}>
					{children}
				</a>
			);
		}

		return (
			<Link href={href} className={combinedClassName}>
				{children}
			</Link>
		);
	}

	// Si no tiene href, renderizar como button
	return (
		<button className={combinedClassName} {...props}>
			{children}
		</button>
	);
}
