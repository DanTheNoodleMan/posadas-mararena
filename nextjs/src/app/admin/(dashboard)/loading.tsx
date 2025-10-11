// src/app/admin/(dashboard)/loading.tsx
// Skeleton loading state para el dashboard

export default function DashboardLoading() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<div>
					<div className="h-9 w-48 bg-neutral-200 rounded"></div>
					<div className="h-5 w-64 bg-neutral-100 rounded mt-2"></div>
				</div>
				<div className="h-10 w-40 bg-neutral-200 rounded-lg"></div>
			</div>

			{/* Métricas Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<div className="h-4 w-24 bg-neutral-200 rounded"></div>
								<div className="h-8 w-16 bg-neutral-200 rounded mt-2"></div>
							</div>
							<div className="w-12 h-12 bg-neutral-100 rounded-lg"></div>
						</div>
						<div className="h-3 w-32 bg-neutral-100 rounded mt-4"></div>
					</div>
				))}
			</div>

			{/* Grid Principal Skeleton */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Columna Izquierda: Listas */}
				<div className="lg:col-span-2 space-y-6">
					{/* 3 cards de listas */}
					{[1, 2, 3].map((section) => (
						<div key={section} className="bg-white rounded-xl shadow-sm border border-neutral-200">
							{/* Header */}
							<div className="p-6 border-b border-neutral-200">
								<div className="flex items-center justify-between">
									<div className="h-6 w-48 bg-neutral-200 rounded"></div>
									<div className="h-4 w-20 bg-neutral-100 rounded"></div>
								</div>
							</div>

							{/* Items */}
							<div className="divide-y divide-neutral-200">
								{[1, 2, 3, 4, 5].map((item) => (
									<div key={item} className="p-4">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1 space-y-2">
												{/* Badges */}
												<div className="flex items-center gap-2">
													<div className="h-5 w-20 bg-neutral-200 rounded"></div>
													<div className="h-5 w-16 bg-neutral-200 rounded"></div>
													<div className="h-5 w-24 bg-neutral-200 rounded"></div>
												</div>
												{/* Nombre */}
												<div className="h-5 w-40 bg-neutral-200 rounded"></div>
												{/* Info */}
												<div className="h-4 w-56 bg-neutral-100 rounded"></div>
												<div className="h-3 w-32 bg-neutral-100 rounded"></div>
											</div>
											{/* Precio y botones */}
											<div className="flex items-center gap-2">
												<div className="h-5 w-16 bg-neutral-200 rounded"></div>
												<div className="flex gap-1">
													<div className="w-8 h-8 bg-neutral-100 rounded-lg"></div>
													<div className="w-8 h-8 bg-green-100 rounded-lg"></div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Columna Derecha: Calendario Skeleton */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
						<div className="h-6 w-32 bg-neutral-200 rounded mb-4"></div>

						{/* Leyenda */}
						<div className="flex items-center gap-4 mb-4">
							<div className="flex items-center gap-1.5">
								<div className="w-3 h-3 bg-neutral-200 rounded"></div>
								<div className="h-3 w-16 bg-neutral-100 rounded"></div>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-3 h-3 bg-neutral-200 rounded"></div>
								<div className="h-3 w-12 bg-neutral-100 rounded"></div>
							</div>
						</div>

						{/* Header días */}
						<div className="grid grid-cols-7 gap-1 mb-2">
							{[1, 2, 3, 4, 5, 6, 7].map((i) => (
								<div key={i} className="h-4 bg-neutral-100 rounded"></div>
							))}
						</div>

						{/* Grid días */}
						<div className="grid grid-cols-7 gap-1">
							{Array.from({ length: 35 }).map((_, i) => (
								<div key={i} className="aspect-square bg-neutral-100 rounded"></div>
							))}
						</div>

						{/* Link */}
						<div className="mt-4 pt-4 border-t border-neutral-200">
							<div className="h-5 w-full bg-neutral-100 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
