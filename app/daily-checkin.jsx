import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import AppHeader from "../components/AppHeader";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { getAuthErrorMessage, logout } from "../services/authService";
import {
  createCheckin,
  getTodayCheckin,
  updateCheckin,
} from "../services/checkinsService";

const MOOD_OPTIONS = ["bien", "regular", "mal", "cansado", "animado", "triste"];

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function toInputValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export default function DailyCheckinScreen() {
  const [checkinId, setCheckinId] = useState(null);
  const [generalFeeling, setGeneralFeeling] = useState("");
  const [painLevel, setPainLevel] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [mood, setMood] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [symptomsToday, setSymptomsToday] = useState("");
  const [personalNotes, setPersonalNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function fillForm(checkin) {
    setCheckinId(checkin.id);
    setGeneralFeeling(toInputValue(checkin.general_feeling));
    setPainLevel(toInputValue(checkin.pain_level));
    setEnergyLevel(toInputValue(checkin.energy_level));
    setMood(toInputValue(checkin.mood));
    setSleepHours(toInputValue(checkin.sleep_hours));
    setSymptomsToday(toInputValue(checkin.symptoms_today));
    setPersonalNotes(toInputValue(checkin.personal_notes));
  }

  async function loadCheckin() {
    try {
      setError("");
      const todayStatus = await getTodayCheckin();

      if (todayStatus.hasCheckinToday && todayStatus.checkin) {
        fillForm(todayStatus.checkin);
      }
    } catch (loadError) {
      if (loadError?.response?.status === 401 || loadError?.response?.status === 403) {
        await logout();
        router.replace("/login");
        return;
      }

      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    const parsedPain = Number(painLevel);
    const parsedEnergy = Number(energyLevel);
    const parsedSleep = sleepHours ? Number(sleepHours) : null;

    if (!painLevel || Number.isNaN(parsedPain) || parsedPain < 0 || parsedPain > 10) {
      return "El nivel de dolor debe estar entre 0 y 10.";
    }

    if (!energyLevel || Number.isNaN(parsedEnergy) || parsedEnergy < 0 || parsedEnergy > 10) {
      return "El nivel de energía debe estar entre 0 y 10.";
    }

    if (parsedSleep !== null && (Number.isNaN(parsedSleep) || parsedSleep < 0 || parsedSleep > 24)) {
      return "Las horas de sueño deben estar entre 0 y 24.";
    }

    return null;
  }

  async function handleSave() {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      checkin_date: getTodayDate(),
      general_feeling: generalFeeling.trim() || undefined,
      pain_level: Number(painLevel),
      energy_level: Number(energyLevel),
      mood: mood.trim() || undefined,
      sleep_hours: sleepHours ? Number(sleepHours) : undefined,
      symptoms_today: symptomsToday.trim() || undefined,
      personal_notes: personalNotes.trim() || undefined,
    };

    try {
      setError("");
      setSaving(true);

      if (checkinId) {
        await updateCheckin(checkinId, payload);
      } else {
        await createCheckin(payload);
      }

      router.replace("/home");
    } catch (saveError) {
      if (saveError?.response?.status === 401 || saveError?.response?.status === 403) {
        await logout();
        router.replace("/login");
        return;
      }

      if (saveError?.response?.status === 409) {
        setError("Ya existe un chequeo para hoy. Puedes editarlo.");
        return;
      }

      setError(getAuthErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadCheckin();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AppHeader
        title={checkinId ? "Editar chequeo diario" : "Chequeo diario"}
        subtitle="Registra cómo te encuentras hoy para seguir tu evolución."
        showBack
        onBack={() => router.replace("/home")}
      />

      {loading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Cargando chequeo diario...</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <InputField
            label="¿Cómo te encuentras hoy?"
            value={generalFeeling}
            onChangeText={setGeneralFeeling}
            placeholder="Me encuentro regular hoy"
          />
          <InputField
            label="Nivel de dolor 0-10"
            value={painLevel}
            onChangeText={setPainLevel}
            placeholder="6"
            keyboardType="numeric"
          />
          <InputField
            label="Nivel de energía 0-10"
            value={energyLevel}
            onChangeText={setEnergyLevel}
            placeholder="4"
            keyboardType="numeric"
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Estado de ánimo</Text>
            <View style={styles.chips}>
              {MOOD_OPTIONS.map((option) => (
                <MoodChip
                  key={option}
                  title={option}
                  selected={mood === option}
                  onPress={() => setMood(option)}
                />
              ))}
            </View>
          </View>

          <InputField
            label="Horas de sueño"
            value={sleepHours}
            onChangeText={setSleepHours}
            placeholder="6.5"
            keyboardType="decimal-pad"
          />
          <InputField
            label="Síntomas de hoy"
            value={symptomsToday}
            onChangeText={setSymptomsToday}
            placeholder="Fatiga, dolor articular"
          />
          <InputField
            label="Notas personales"
            value={personalNotes}
            onChangeText={setPersonalNotes}
            placeholder="Hoy he dormido poco y me noto más cansado."
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title={checkinId ? "Guardar cambios" : "Guardar chequeo"}
            onPress={handleSave}
            loading={saving}
          />
        </View>
      )}
    </ScrollView>
  );
}

function MoodChip({ title, selected, onPress }) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{title}</Text>
    </Pressable>
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
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  loadingText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },
  chipText: {
    color: "#475569",
    fontWeight: "800",
  },
  chipTextSelected: {
    color: "#1D4ED8",
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
