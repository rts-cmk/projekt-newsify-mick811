import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { DefaultNotFound } from "./components/default-not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				staleTime: 1000 * 60 * 30,
				gcTime: 1000 * 60 * 60,
				retry: 1,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		// react-query will handle data fetching & caching
		// https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: DefaultNotFound,
		scrollRestoration: true,
		defaultStructuralSharing: true,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		handleRedirects: true,
		wrapQueryClient: true,
	});

	return router;
}
