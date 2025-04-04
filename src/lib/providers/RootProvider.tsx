"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren, Suspense } from "react";
import { ThemeProvider } from "./ThemeProvider";
import LoadingComponent from "@/components/common/loading/loading";

const RootProvider: React.FC<PropsWithChildren> = (props) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Suspense fallback={<LoadingComponent />}>{props.children}</Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootProvider;
