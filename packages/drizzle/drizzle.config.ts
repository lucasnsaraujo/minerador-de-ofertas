import { defineConfig } from "drizzle-kit"
import dotenv from "dotenv"
console.log("dotenv.config()")
dotenv.config({ path: "../../server.env" })
let databaseUrl = process.env.DATABASE_URL!

if (!databaseUrl) {
  throw new Error("databaseUrl is not defined. Make sure server.env is loaded.")
}
if (process.env.SSL_MODE === "require") {
  databaseUrl = databaseUrl + "?sslmode=require"
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
})
