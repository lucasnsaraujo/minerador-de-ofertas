import userRouter from "./userRouter"
import sessionRouter from "./sessionRouter"
import healthRouter from "./healthRouter"
import offerRouter from "./offerRouter"
import { router } from "../trpc"

export const appRouter = router({
  session: sessionRouter,
  health: healthRouter,
  user: userRouter,
  offer: offerRouter,
})

export type AppRouter = typeof appRouter
