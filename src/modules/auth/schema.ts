import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().nonempty({ error: "Username is required" }),
	password: z.string().nonempty({ error: "Password is required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		email: z.email().nonempty({ error: "Email is required" }),
		name: z
			.string()
			.nonempty({ error: "Name is required" })
			.min(5, { error: "Name too short" })
			.max(20, { error: "Name too long" })
			.regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
				error: "Name can only contain letters and a single space between words",
			}),

		username: z
			.string()
			.nonempty({ error: "Username is required" })
			.min(4, { error: "Username too short" })
			.max(15, { error: "Username too long" })
			.regex(/^[a-z0-9]+$/, {
				error: "Username can only contain lowercase letters and numbers",
			}),

		password: z
			.string()
			.nonempty({ error: "Password is required" })
			.min(8, { error: "Password too short" })
			.max(25, { error: "Password too long" })
			.regex(/[A-Z]/, {
				error: "Password must contain at least one uppercase letter",
			})
			.regex(/[a-z]/, {
				error: "Password must contain at least one lowercase letter",
			})
			.regex(/[0-9]/, { error: "Password must contain at least one number" })
			.regex(/[^a-zA-Z0-9]/, {
				error: "Password must contain at least one special character",
			}),

		confirmPassword: z
			.string()
			.nonempty({ error: "Confirm Password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type RegisterSchema = z.infer<typeof registerSchema>;
