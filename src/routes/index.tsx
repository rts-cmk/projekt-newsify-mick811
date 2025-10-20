import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { signIn, useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div>
			<div>
				<h1>React TanStarter</h1>
				<div>
					This is an unprotected page:
					<pre>routes/index.tsx</pre>
				</div>
			</div>

			<Suspense fallback={<div>Loading user...</div>}>
				<UserAction />
			</Suspense>
		</div>
	);
}

function UserAction() {
	const { data: session } = useSession();

	return session ? (
		<div>
			<p>Welcome back, {session.user.name}!</p>
			<div>
				Session user:
				<pre>{JSON.stringify(session.user, null, 2)}</pre>
			</div>
		</div>
	) : (
		<div>
			<p>You are not signed in.</p>
			<button
				type="button"
				onClick={() =>
					signIn.social({
						provider: "github",
					})
				}
			>
				Sign in
			</button>
		</div>
	);
}
