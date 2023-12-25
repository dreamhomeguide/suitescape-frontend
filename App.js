import "expo-dev-client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import React from "react";

import Root from "./Root";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

SplashScreen.preventAutoHideAsync().catch((err) => console.log(err));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
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
