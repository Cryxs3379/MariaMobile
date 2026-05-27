import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import AppHeader from "../components/AppHeader";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { getAuthErrorMessage, logout } from "../services/authService";
import { getDiseases } from "../services/diseasesService";
import { createPost } from "../services/forumService";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [error, setError] = useState("");

  async function loadDiseases() {
    try {
      const data = await getDiseases();
      setDiseases(data);
    } catch (loadError) {
      if (loadError?.response?.status === 401 || loadError?.response?.status === 403) {
        await logout();
        router.replace("/login");
        return;
      }

      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoadingDiseases(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!content.trim()) {
      setError("El contenido es obligatorio.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await createPost({
        title: title.trim(),
        content: content.trim(),
        disease_id: selectedDiseaseId || undefined,
      });
      router.replace("/forum");
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

  useEffect(() => {
    loadDiseases();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AppHeader
        title="Crear publicación"
        subtitle="Comparte una pregunta o experiencia."
        showBack
        onBack={() => router.replace("/forum")}
      />

      <View style={styles.card}>
        <InputField label="Título" value={title} onChangeText={setTitle} placeholder="¿Alguien tiene fatiga por las mañanas?" />
        <InputField
          label="Contenido"
          value={content}
          onChangeText={setContent}
          placeholder="Me pasa desde hace semanas..."
        />

        <Text style={styles.sectionLabel}>Enfermedad opcional</Text>
        <View style={styles.chips}>
          <DiseaseChip
            title="Sin enfermedad específica"
            selected={!selectedDiseaseId}
            onPress={() => setSelectedDiseaseId(null)}
          />
          {diseases.map((disease) => (
            <DiseaseChip
              key={disease.id}
              title={disease.name}
              selected={selectedDiseaseId === disease.id}
              onPress={() => setSelectedDiseaseId(disease.id)}
            />
          ))}
        </View>
        {loadingDiseases ? <Text style={styles.help}>Cargando enfermedades...</Text> : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton title="Publicar" onPress={handleSave} loading={loading} />
      </View>
    </ScrollView>
  );
}

function DiseaseChip({ title, selected, onPress }) {
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
  sectionLabel: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "800",
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
  help: {
    color: "#64748B",
    fontSize: 14,
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
