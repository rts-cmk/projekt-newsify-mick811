import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { authQueryOptions } from "@/lib/queries";
import styles from "@/index.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	beforeLoad: ({ context }) => {
		// we're using react-query for client-side caching to reduce client-to-server calls, see /src/router.tsx
		// better-auth's cookieCache is also enabled server-side to reduce server-to-db calls, see /src/lib/auth/auth.ts
		context.queryClient.prefetchQuery(authQueryOptions());

		// typically we don't need the user immediately in landing pages,
		// so we're only prefetching here and not awaiting.
		// for protected routes with loader data, see /(authenticated)/route.tsx
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Newsify",
			},
		],
		links: [{ rel: "stylesheet", href: styles }],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="da">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
