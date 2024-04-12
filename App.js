import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import Root from "./Root";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
      retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <Root />
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
