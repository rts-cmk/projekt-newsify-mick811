import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";
import { Spinner } from "./components/spinner";
import { SettingsProvider } from "./context/settingsContext";
import Onboarding from "./routes/Onboarding";
import Settings from "./routes/Settings";

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

ReactDOM.createRoot(root).render(
	<SettingsProvider>
		<RouterProvider router={router} />
	</SettingsProvider>,
);
