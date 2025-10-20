import { z } from "zod";

const envSchema = z.object({
	server: z.object({
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(32),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	}),

	socialProviders: z.object({
		github: z.object({
			clientId: z.string(),
			clientSecret: z.string(),
		}),
		google: z.object({
			clientId: z.string(),
			clientSecret: z.string(),
		}),
	}),

	client: z.object({
		VITE_BASE_URL: z.url(),
	}),
});

// Bun automatically loads .env files
const rawEnv = {
	server: {
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		NODE_ENV: process.env.NODE_ENV,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
	},
	client: {
		VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
	},
};

export const env = envSchema.parse(rawEnv);
