import { createTRPCNext } from "@trpc/next";
import { AppRouter } from "@/server/index";

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      url: "/api/trpc",
    };
  },
  ssr: false,
});
