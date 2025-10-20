import {
	ErrorComponent,
	type ErrorComponentProps,
	Link,
	rootRouteId,
	useMatch,
	useRouter,
} from "@tanstack/react-router";

export function DefaultCatchBoundary({ error }: Readonly<ErrorComponentProps>) {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	console.log(error);

	return (
		<div>
			<ErrorComponent error={error} />
			<div>
				<button
					type="button"
					onClick={() => {
						router.invalidate();
					}}
				>
					Try Again
				</button>
				{isRoot ? (
					<button type="button">
						<Link to="/">Home</Link>
					</button>
				) : (
					<button type="button">
						<Link
							to="/"
							onClick={(e) => {
								e.preventDefault();
								window.history.back();
							}}
						>
							Go Back
						</Link>
					</button>
				)}
			</div>
		</div>
	);
}
