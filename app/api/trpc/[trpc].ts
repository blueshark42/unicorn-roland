import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/index";

// tRPC API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
