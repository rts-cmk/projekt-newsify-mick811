import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, redirect, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";
import { SettingsProvider, getSettings } from "./context/settingsContext";
import { SearchProvider } from "./context/searchContext";
import Onboarding from "./routes/Onboarding";
import Settings from "./routes/Settings";
import "./styles/main.scss";
import Login from "./routes/Login";
import Popular from "./routes/Popular";
import Archive from "./routes/Archive";

const router = createBrowserRouter([
	{
		element: <Outlet />,
		children: [
			{
				path: "/onboarding",
				element: <Onboarding />,
			},
			{
				loader: () => {
					const settings = getSettings();
					if (settings.showOnboarding) {
						throw redirect("/onboarding");
					}
					return null;
				},
				children: [
					{
						path: "/login",
						element: <Login />,
					},
					{
						path: "/",
						element: <App />,
					},
					{
						path: "/popular",
						element: <Popular />,
					},
					{
						path: "/archive",
						element: <Archive />,
					},
					{
						path: "/settings",
						element: <Settings />,
					},
				],
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
				<SearchProvider>
					<RouterProvider router={router} />
				</SearchProvider>
			</SettingsProvider>
			<ReactQueryDevtools />
		</PersistQueryClientProvider>
	</React.StrictMode>,
);