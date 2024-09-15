import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { medicalRouter } from "./medicalRouter";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  medical: medicalRouter,
});

export type AppRouter = typeof appRouter;
