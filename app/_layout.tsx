import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';

import { colors } from '@/constants';
import useAuthStore from '@/store/authStore';

// Force dark mode at runtime so iOS never paints its default light system
// backgrounds (source of the white flash during tab switches).
Appearance.setColorScheme('dark');

const queryClient = new QueryClient();

export default function RootLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.primary }}>
      <SafeAreaProvider
        initialMetrics={initialWindowMetrics}
        style={{ backgroundColor: colors.primary }}
      >
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: colors.primary },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Protected guard={!isLoggedIn}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={isLoggedIn}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="[id]" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
