import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import AppHeader from "../components/AppHeader";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { getAuthErrorMessage, logout } from "../services/authService";
import { createSymptom } from "../services/symptomsService";

export default function AddSymptomScreen() {
  const [symptomName, setSymptomName] = useState("");
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");
  const [loggedAt, setLoggedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const parsedIntensity = Number(intensity);

    if (!symptomName.trim()) {
      setError("El nombre del síntoma es obligatorio.");
      return;
    }

    if (!Number.isInteger(parsedIntensity) || parsedIntensity < 1 || parsedIntensity > 10) {
      setError("La intensidad debe ser un número entre 1 y 10.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await createSymptom({
        symptom_name: symptomName.trim(),
        intensity: parsedIntensity,
        notes: notes.trim() || undefined,
        logged_at: loggedAt.trim() || undefined,
      });
      router.replace("/symptoms");
    } catch (saveError) {
      if (saveError?.response?.status === 401 || saveError?.response?.status === 403) {
        await logout();
        router.replace("/login");
        return;
      }

      setError(getAuthErrorMessage(saveError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AppHeader
        title="Añadir síntoma"
        subtitle="Registra cómo te encuentras hoy."
        showBack
        onBack={() => router.replace("/symptoms")}
      />

      <View style={styles.card}>
        <InputField
          label="Nombre del síntoma"
          value={symptomName}
          onChangeText={setSymptomName}
          placeholder="Fatiga"
        />
        <InputField
          label="Intensidad"
          value={intensity}
          onChangeText={setIntensity}
          placeholder="1 a 10"
          keyboardType="numeric"
        />
        <InputField
          label="Notas"
          value={notes}
          onChangeText={setNotes}
          placeholder="Me sentí cansado por la mañana"
        />
        <InputField
          label="Fecha/hora opcional"
          value={loggedAt}
          onChangeText={setLoggedAt}
          placeholder="2026-05-27T10:00:00.000Z"
          autoCapitalize="none"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton title="Guardar síntoma" onPress={handleSave} loading={loading} />
      </View>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    gap: 18,
    padding: 20,
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
