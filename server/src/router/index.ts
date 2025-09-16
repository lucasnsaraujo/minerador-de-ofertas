import userRouter from "./userRouter"
import sessionRouter from "./sessionRouter"
import healthRouter from "./healthRouter"
import gameRouter from "./gameRouter"
import messageRouter from "./messageRouter"
import { router } from "../trpc"

export const appRouter = router({
  session: sessionRouter,
  health: healthRouter,
  game: gameRouter,
  user: userRouter,
  message: messageRouter,
})

export type AppRouter = typeof appRouter
