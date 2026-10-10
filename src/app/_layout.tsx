import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { LibraryProvider } from '@/context/LibraryContext';
import { colors } from '@/constants/tokens';

export default function RootLayout() {
  const [loaded] = useFonts({
    Lora_400Regular, Lora_700Bold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });
  if (!loaded) return null;

  return (
    <LibraryProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerTitle: '',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="story/[id]" />
        <Stack.Screen name="read/[id]" />
        <Stack.Screen name="author/[id]" />
        <Stack.Screen name="genre/[name]" />
      </Stack>
    </LibraryProvider>
  );
}
