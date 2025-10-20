import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "@/db";
import { env } from "@/env";

export const auth = betterAuth({
	baseURL: env.client.VITE_BASE_URL,
	secret: env.server.BETTER_AUTH_SECRET,

	telemetry: {
		enabled: false,
	},

	database: drizzleAdapter(db, {
		provider: "pg",
	}),

	// https://www.better-auth.com/docs/integrations/tanstack#usage-tips
	plugins: [reactStartCookies()],

	// https://www.better-auth.com/docs/concepts/session-management#session-caching
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},

	// https://www.better-auth.com/docs/concepts/oauth
	socialProviders: {
		github: {
			clientId: env.socialProviders.github.clientId,
			clientSecret: env.socialProviders.github.clientSecret,
		},
		google: {
			clientId: env.socialProviders.google.clientId,
			clientSecret: env.socialProviders.google.clientSecret,
		},
	},

	// https://www.better-auth.com/docs/authentication/email-password
	emailAndPassword: {
		enabled: true,
	},
});
