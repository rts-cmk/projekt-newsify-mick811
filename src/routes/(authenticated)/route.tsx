import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "@/lib/queries";

export const Route = createFileRoute("/(authenticated)")({
	ssr: false,
	component: Outlet,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});
		if (!user) {
			const onboarding = localStorage.getItem("onboarding_completed");
			if (!onboarding) {
				throw redirect({ to: "/onboarding" });
			}

			throw redirect({ to: "/login" });
		}

		// re-return to update type as non-null for child routes
		return { user };
	},
});
