import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import DailyCheckinCard from "../components/DailyCheckinCard";
import PrimaryButton from "../components/PrimaryButton";
import {
  getMe,
  getAuthErrorMessage,
  logout,
  restoreSession,
} from "../services/authService";
import { getTodayCheckin } from "../services/checkinsService";
import { saveUser } from "../storage/authStorage";

function formatBoolean(value) {
  return value ? "Sí" : "No";
}

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayCheckinStatus, setTodayCheckinStatus] = useState(null);
  const [loadingCheckin, setLoadingCheckin] = useState(true);
  const [error, setError] = useState("");

  async function loadUser({ showLoader = false } = {}) {
    try {
      setError("");
      if (showLoader) {
        setRefreshing(true);
      }

      const currentUser = await getMe();
      await saveUser(currentUser);
      setUser(currentUser);
    } catch (loadError) {
      if (loadError?.response?.status === 401 || loadError?.response?.status === 403) {
        await logout();
        router.replace("/login");
        return;
      }

      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function restoreUserSession() {
    try {
      const restoredUser = await restoreSession();

      if (!restoredUser) {
        router.replace("/login");
        return;
      }

      setUser(restoredUser);
      await loadTodayCheckin();
    } catch {
      await logout();
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  async function loadTodayCheckin() {
    try {
      setLoadingCheckin(true);
      const status = await getTodayCheckin();
      setTodayCheckinStatus(status);
    } catch (checkinError) {
      if (checkinError?.response?.status === 401 || checkinError?.response?.status === 403) {
        await logout();
        router.replace("/login");
        return;
      }

      setError(getAuthErrorMessage(checkinError));
    } finally {
      setLoadingCheckin(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  useEffect(() => {
    restoreUserSession();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        loadTodayCheckin();
      }
    }, [loading])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#2563EB" size="large" />
        <Text style={styles.loadingText}>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Bienvenido a Maria App</Text>
        <Text style={styles.subtitle}>
          Tu sesión está conectada con el backend real.
        </Text>
      </View>

      <DailyCheckinCard
        todayStatus={todayCheckinStatus}
        loading={loadingCheckin}
        onPress={() => router.push("/daily-checkin")}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Datos del usuario</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.infoList}>
          <InfoRow label="Nombre" value={user?.name || "No disponible"} />
          <InfoRow label="Email" value={user?.email || "No disponible"} />
          <InfoRow label="Rol" value={user?.role || "No disponible"} />
          <InfoRow
            label="Verificado"
            value={formatBoolean(Boolean(user?.is_verified))}
          />
          <InfoRow label="Estado" value={user?.status || "No disponible"} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.versionText}>
          Continúa con el registro de síntomas, el calendario y el foro. Todo
          está conectado con el backend real.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="Registro de síntomas"
          onPress={() => router.push("/symptoms")}
        />
        <PrimaryButton title="Calendario" onPress={() => router.push("/calendar")} />
        <PrimaryButton title="Foro" onPress={() => router.push("/forum")} />
        <PrimaryButton
          title="Actualizar usuario"
          onPress={() => loadUser({ showLoader: true })}
          loading={refreshing}
        />
        <PrimaryButton title="Cerrar sesión" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "700",
  },
  container: {
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
    padding: 24,
    paddingTop: 64,
  },
  hero: {
    marginBottom: 24,
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 20px rgba(15, 23, 42, 0.06)",
      },
      default: {
        elevation: 3,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
      },
    }),
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
  },
  infoLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  versionText: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  error: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
    padding: 12,
  },
});
