import { StyleSheet, Text, View } from "react-native";

import PrimaryButton from "./PrimaryButton";

function formatDate(value) {
  if (!value) {
    return "Fecha no disponible";
  }

  return new Date(value).toLocaleString();
}

export default function SymptomCard({ symptom, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{symptom.symptom_name}</Text>
        <Text style={styles.intensity}>Intensidad {symptom.intensity}/10</Text>
      </View>
      <Text style={styles.date}>{formatDate(symptom.logged_at)}</Text>
      {symptom.notes ? <Text style={styles.notes}>{symptom.notes}</Text> : null}
      {onDelete ? (
        <View style={styles.action}>
          <PrimaryButton title="Eliminar" onPress={() => onDelete(symptom.id)} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  header: {
    gap: 8,
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
  },
  intensity: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  date: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },
  notes: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
  },
  action: {
    marginTop: 4,
  },
});
