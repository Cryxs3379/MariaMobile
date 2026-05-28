import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import PrimaryButton from "./PrimaryButton";

function formatSleepHours(value) {
  if (value === null || value === undefined || value === "") {
    return "No registrado";
  }

  return `${value} h`;
}

export default function DailyCheckinCard({ todayStatus, loading, onPress }) {
  const checkin = todayStatus?.checkin;

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#2563EB" />
        <Text style={styles.loadingText}>Comprobando chequeo diario...</Text>
      </View>
    );
  }

  if (!todayStatus?.hasCheckinToday || !checkin) {
    return (
      <View style={styles.card}>
        <Text style={styles.badge}>Chequeo de hoy</Text>
        <Text style={styles.title}>No has hecho tu chequeo diario</Text>
        <Text style={styles.description}>
          Dedica un minuto a registrar cómo te encuentras hoy.
        </Text>
        <PrimaryButton title="Hacer chequeo diario" onPress={onPress} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.badgeCompleted}>Chequeo de hoy</Text>
      <Text style={styles.title}>Chequeo diario completado</Text>
      <Text style={styles.description}>
        Ya has registrado cómo te encuentras hoy.
      </Text>
      <View style={styles.summary}>
        <SummaryItem label="Dolor" value={`${checkin.pain_level}/10`} />
        <SummaryItem label="Energía" value={`${checkin.energy_level}/10`} />
        <SummaryItem label="Ánimo" value={checkin.mood || "No registrado"} />
        <SummaryItem label="Sueño" value={formatSleepHours(checkin.sleep_hours)} />
      </View>
      <PrimaryButton title="Ver / editar chequeo" onPress={onPress} />
    </View>
  );
}

function SummaryItem({ label, value }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BFDBFE",
    borderRadius: 26,
    borderWidth: 1,
    gap: 14,
    marginBottom: 18,
    padding: 20,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 999,
    color: "#92400E",
    fontSize: 13,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeCompleted: {
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    color: "#166534",
    fontSize: 13,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  title: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "900",
  },
  description: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
  },
  loadingText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  summary: {
    gap: 10,
  },
  summaryItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  summaryValue: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },
});
