import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F8FAFC" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="daily-checkin" />
        <Stack.Screen name="symptoms" />
        <Stack.Screen name="add-symptom" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="add-event" />
        <Stack.Screen name="forum" />
        <Stack.Screen name="forum-post" />
        <Stack.Screen name="create-post" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
