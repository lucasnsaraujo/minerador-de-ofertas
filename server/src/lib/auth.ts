import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../context"
import * as schema from "@fsb/drizzle"

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
    },
  },
  emailAndPassword: { enabled: true },
  advanced: { database: { generateId: false } },
  trustedOrigins: ["http://localhost:3000", "https://fsb-client.onrender.com"],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      user: schema.userTable,
      session: schema.sessionTable,
      account: schema.accountTable,
      verification: schema.verificationTable,
    },
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
    cookieOptions: {
      sameSite: "none", // Allow cross-site requests
      // secure: process.env.NODE_ENV === "production", // Only secure in production
      secure: false,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
})
