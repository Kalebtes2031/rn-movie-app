import { Stack } from "expo-router";
import "./globals.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
        <FavoritesProvider>
          {" "}
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="movies/[id]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </FavoritesProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
