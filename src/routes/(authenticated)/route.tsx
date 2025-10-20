import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "@/lib/queries";

export const Route = createFileRoute("/(authenticated)")({
	component: Outlet,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});
		if (!user) {
			throw redirect({ to: "/login" });
		}

		// re-return to update type as non-null for child routes
		return { user };
	},
});
