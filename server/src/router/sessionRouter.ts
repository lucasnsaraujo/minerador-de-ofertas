import { adminProcedure, protectedProcedure, publicProcedure, router } from "../trpc"
import { z } from "zod"
import { sessionTable } from "@fsb/drizzle"
import { drizzleOrm } from "@fsb/drizzle"
import { auth } from "../lib/auth"
const { count, eq } = drizzleOrm

const sessionRouter = router({
  login: publicProcedure.input(z.object({ email: z.string(), password: z.string() })).mutation(async (opts) => {
    console.log("login", opts.input)
    const response = await auth.api.signInEmail({
      body: {
        email: opts.input.email,
        password: opts.input.password,
      },
      asResponse: true, // returns a response object instead of data
    })
    console.log("response", response)

    // Set the cookie from the response headers
    const setCookieHeader = response.headers.get("set-cookie")
    if (setCookieHeader) {
      opts.ctx.res.header("Set-Cookie", setCookieHeader)
    }

    return true
  }),
  signup: publicProcedure
    .input(z.object({ email: z.string(), password: z.string(), name: z.string() }))
    .mutation(async (opts) => {
      console.log("signup", opts.input)
      const response = await auth.api.signUpEmail({
        body: {
          email: opts.input.email,
          password: opts.input.password,
          name: opts.input.name,
        },
        asResponse: true,
      })
      console.log("response", response)
      // Set the cookie from the response headers
      const setCookieHeader = response.headers.get("set-cookie")
      if (setCookieHeader) {
        opts.ctx.res.header("Set-Cookie", setCookieHeader)
      }
      return true
    }),

  deleteSession: adminProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const db = opts.ctx.db
      await db.delete(sessionTable).where(eq(sessionTable.id, opts.input.sessionId))

      return true
    }),

  getSessions: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        search: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async (opts) => {
      const page = opts.input.page
      const limit = 12
      const db = opts.ctx.db
      const sessions = await db.query.sessionTable.findMany({
        limit,
        offset: (page - 1) * limit,

        columns: { id: true, createdAt: true, userAgent: true, ipAddress: true },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },

        where: opts.input.userId ? eq(sessionTable.userId, opts.input.userId) : undefined,
      })

      const totalData = await db.select({ count: count() }).from(sessionTable)
      // .where(opts.input.search ? ilike(devicesTable.name, `%${opts.input.search}%`) : undefined)
      const total = totalData[0].count

      return { sessions, page, limit, total }
    }),
})

export default sessionRouter
