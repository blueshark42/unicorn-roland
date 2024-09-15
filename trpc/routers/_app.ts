import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { medicalRouter } from "./medicalRouter";

export const appRouter = createTRPCRouter({
  medical: medicalRouter,
  favorite: baseProcedure.input(z.string()).mutation(({ input }) => {
    const favorites = [];
    favorites.push(input);

    console.log("New favorite! ->", favorites);

    // We could save this to localStorage, push to DB via API, or similar.

    // localStorage.setItem(LocalStorageEnum.Favorites, favorites)

    // Not handling types here but favorites could be a list/array of IDs (bloodborne-chart, testing-chart, ...)
    // db.query("UPDATE favorites SET favorites = favorites WHERE userId = userIdLocal")

    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;
