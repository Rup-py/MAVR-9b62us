import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <UserProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: '#000000' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding/role" />
            <Stack.Screen name="onboarding/individual" />
            <Stack.Screen name="onboarding/trainer" />
            <Stack.Screen name="onboarding/connect" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="trainer/dashboard" />
            <Stack.Screen name="trainer/student" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="checkin/morning" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="checkin/workout" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="checkin/night" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="vault/index" />
            <Stack.Screen name="connects/individual" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="connects/chat" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="unlock" options={{ animation: 'slide_from_bottom' }} />
          </Stack>
        </UserProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
