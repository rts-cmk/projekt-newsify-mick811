import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";
import { Spinner } from "./components/spinner";
import { SettingsProvider } from "./context/settingsContext";
import Onboarding from "./routes/Onboarding";
import Settings from "./routes/Settings";
import "./styles/main.scss";

const router = createBrowserRouter([
	{
		// this element is shown while the route is loading data
		hydrateFallbackElement: (
			<div className="fallback">
				<Spinner />
			</div>
		),
		children: [
			{
				path: "/",
				element: <App />,
				loader: async () =>
					new Promise((resolve) => {
						setTimeout(() => {
							resolve(null);
						}, 1000);
					}),
			},
			{
				path: "/settings",
				element: <Settings />,
			},
			{
				path: "/onboarding/:id",
				element: <Onboarding />,
			},
		],
	},
]);

const root = document.getElementById("root") as HTMLElement;
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
});

const persister = createAsyncStoragePersister({
	storage: window.localStorage,
});

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			<SettingsProvider>
				<RouterProvider router={router} />
			</SettingsProvider>
			<ReactQueryDevtools />
		</PersistQueryClientProvider>
	</React.StrictMode>,
);
