import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import AppHeader from "../components/AppHeader";
import PrimaryButton from "../components/PrimaryButton";
import SymptomCard from "../components/SymptomCard";
import { getAuthErrorMessage, logout } from "../services/authService";
import { deleteSymptom, getSymptoms } from "../services/symptomsService";

export default function SymptomsScreen() {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadSymptoms({ showLoader = false } = {}) {
    try {
      setError("");
      if (showLoader) {
        setRefreshing(true);
      }

      const data = await getSymptoms();
      setSymptoms(data);
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

  async function handleDelete(id) {
    try {
      await deleteSymptom(id);
      await loadSymptoms({ showLoader: true });
    } catch (deleteError) {
      setError(getAuthErrorMessage(deleteError));
    }
  }

  useEffect(() => {
    loadSymptoms();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSymptoms();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader
        title="Registro de síntomas"
        subtitle="Consulta tu historial y registra nuevos síntomas."
        showBack
        onBack={() => router.replace("/home")}
      />

      <View style={styles.actions}>
        <PrimaryButton title="Añadir síntoma" onPress={() => router.push("/add-symptom")} />
        <PrimaryButton
          title="Actualizar"
          onPress={() => loadSymptoms({ showLoader: true })}
          loading={refreshing}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2563EB" />
          <Text style={styles.loadingText}>Cargando síntomas...</Text>
        </View>
      ) : symptoms.length === 0 ? (
        <Text style={styles.empty}>Todavía no has registrado síntomas.</Text>
      ) : (
        <View style={styles.list}>
          {symptoms.map((symptom) => (
            <SymptomCard key={symptom.id} symptom={symptom} onDelete={handleDelete} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
    padding: 24,
    paddingTop: 64,
  },
  actions: {
    gap: 12,
    marginBottom: 18,
  },
  list: {
    gap: 14,
  },
  loadingBox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 24,
  },
  loadingText: {
    color: "#64748B",
    fontWeight: "700",
  },
  empty: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 20,
    borderWidth: 1,
    color: "#64748B",
    fontSize: 16,
    fontWeight: "700",
    padding: 18,
    textAlign: "center",
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
