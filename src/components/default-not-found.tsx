import { Link } from "@tanstack/react-router";

export function DefaultNotFound() {
	return (
		<div>
			<p>The page you're looking for does not exist.</p>
			<p>
				<button
					type="button"
					onClick={() => {
						window.history.back();
					}}
				>
					Go Back
				</button>
				<button type="button">
					<Link to="/">Home</Link>
				</button>
			</p>
		</div>
	);
}
