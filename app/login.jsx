import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { login } from "../services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("admin@local");
  const [password, setPassword] = useState("789521789521");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Introduce email y password.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await login(cleanEmail, password);
      router.replace("/home");
    } catch (loginError) {
      setError(loginError.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.appName}>Maria App</Text>
          <Text style={styles.subtitle}>
            Accede a tu espacio sobre enfermedades autoinmunes.
          </Text>
        </View>

        <View style={styles.card}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@local"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Introduce tu password"
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title="Iniciar sesión"
            onPress={handleLogin}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 28,
  },
  appName: {
    color: "#0F172A",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    gap: 18,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 20px rgba(15, 23, 42, 0.08)",
      },
      default: {
        elevation: 4,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
    }),
  },
  error: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "700",
    padding: 12,
  },
});
