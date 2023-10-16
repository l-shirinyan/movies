"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

interface IProps {
  children: ReactNode
}

function QueryProvider({ children }: IProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
};

export default QueryProvider;