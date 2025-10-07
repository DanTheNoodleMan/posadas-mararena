"use client";

import React from "react";
import { Minus, Plus, Users } from "lucide-react";

interface GuestSelectorProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	label?: string;
	className?: string;
}

export default function GuestSelector({
	value,
	onChange,
	min = 1,
	max = 50,
	label = "Número de Huéspedes",
	className = ""
}: GuestSelectorProps) {
	const handleDecrement = () => {
		if (value > min) {
			onChange(value - 1);
		}
	};

	const handleIncrement = () => {
		if (value < max) {
			onChange(value + 1);
		}
	};

	return (
		<div className={className}>
			<label className="block text-sm font-semibold text-primary-600 mb-3">
				{label}
			</label>
			<div className="flex items-center justify-between bg-neutral-50 border-2 border-neutral-300 rounded-sm p-4">
				<div className="flex items-center gap-3">
					<Users className="w-5 h-5 text-accent-500" />
					<span className="text-primary-600">
						{value} {value === 1 ? 'huésped' : 'huéspedes'}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleDecrement}
						disabled={value <= min}
						className="w-10 h-10 rounded-full border-2 border-accent-500 flex items-center justify-center hover:bg-accent-500 hover:text-primary-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-accent-500"
					>
						<Minus className="w-4 h-4" />
					</button>
					<span className="font-semibold text-xl text-primary-600 w-8 text-center">
						{value}
					</span>
					<button
						type="button"
						onClick={handleIncrement}
						disabled={value >= max}
						className="w-10 h-10 rounded-full border-2 border-accent-500 flex items-center justify-center hover:bg-accent-500 hover:text-primary-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-accent-500"
					>
						<Plus className="w-4 h-4" />
					</button>
				</div>
			</div>
			{max && (
				<p className="text-xs text-primary-600/60 mt-2">
					Capacidad máxima: {max} {max === 1 ? 'persona' : 'personas'}
				</p>
			)}
		</div>
	);
}