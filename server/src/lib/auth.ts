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
  advanced: {
    database: { generateId: false },
    useSecureCookies: false,
    cookies: {
      session_token: {
        name: "fsb",
        attributes: {
          httpOnly: false,
          secure: false,
        },
      },
    },
    defaultCookieAttributes: {
      httpOnly: false,
      secure: false,
    },
    cookiePrefix: "fsb",
    // crossSubDomainCookies: {
    //   enabled: true,
    // },
  },
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
})
