import { medicalRouter } from "./routers/medical";
import { router } from "./trpc";

export const appRouter = router({
  medical: medicalRouter,
});

export type AppRouter = typeof appRouter;
