// Since this app doesn't use tRPC and has no backend, we'll create a minimal setup
// that satisfies TypeScript without breaking the build

import { createTRPCReact } from "@trpc/react-query";

// Create a minimal router type that satisfies tRPC's constraints
export type AppRouter = {
  _def: {
    _config: any;
    router: true;
    procedures: any;
    record: any;
  };
  createCaller: (ctx: any) => any;
};

// Create the tRPC client (not used in the app but prevents build errors)
export const trpc = createTRPCReact<AppRouter>();

// This client is not used since the app has no backend
export const trpcClient = trpc.createClient({
  links: [],
});