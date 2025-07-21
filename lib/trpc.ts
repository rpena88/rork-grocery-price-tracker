import { createTRPCReact } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import superjson from "superjson";

// Create a simple type for the router since we're removing the backend
export type AppRouter = {
  example: {
    hi: {
      input: { name: string };
      output: { hello: string; date: Date };
    };
  };
};

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return 'http://localhost:3000';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
        });
      },
    }),
  ],
});