import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import AppHeader from "../components/AppHeader";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { getAuthErrorMessage, logout } from "../services/authService";
import { createEvent } from "../services/eventsService";

const EVENT_TYPES = ["general", "medical", "medication", "symptom", "reminder"];

export default function AddEventScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("medical");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!startDate.trim()) {
      setError("La fecha de inicio es obligatoria.");
      return;
    }

    if (!EVENT_TYPES.includes(eventType)) {
      setError("El tipo de evento no es válido.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        event_type: eventType,
        start_date: startDate.trim(),
        end_date: endDate.trim() || undefined,
      });
      router.replace("/calendar");
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
        title="Añadir evento"
        subtitle="Usa fechas ISO, por ejemplo 2026-05-28T09:00:00.000Z."
        showBack
        onBack={() => router.replace("/calendar")}
      />

      <View style={styles.card}>
        <InputField label="Título" value={title} onChangeText={setTitle} placeholder="Cita médica" />
        <InputField
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          placeholder="Revisión con reumatología"
        />
        <InputField
          label="Tipo de evento"
          value={eventType}
          onChangeText={setEventType}
          placeholder="general, medical, medication, symptom, reminder"
          autoCapitalize="none"
        />
        <InputField
          label="Fecha de inicio"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="2026-05-28T09:00:00.000Z"
          autoCapitalize="none"
        />
        <InputField
          label="Fecha de fin opcional"
          value={endDate}
          onChangeText={setEndDate}
          placeholder="2026-05-28T10:00:00.000Z"
          autoCapitalize="none"
        />

        <Text style={styles.help}>Tipos permitidos: {EVENT_TYPES.join(", ")}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton title="Guardar evento" onPress={handleSave} loading={loading} />
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
  help: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
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
