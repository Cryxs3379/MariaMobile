import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { restoreSession } from "../services/authService";

export default function IndexScreen() {
  useEffect(() => {
    async function checkSession() {
      const user = await restoreSession();
      router.replace(user ? "/home" : "/login");
    }

    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#2563EB" size="large" />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    padding: 24,
  },
  text: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "700",
  },
});
