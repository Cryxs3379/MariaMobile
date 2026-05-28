import { StyleSheet, Text, View } from "react-native";

function formatDate(value) {
  if (!value) {
    return "Fecha no disponible";
  }

  return new Date(value).toLocaleDateString();
}

function formatSleepHours(value) {
  if (value === null || value === undefined || value === "") {
    return "No registrado";
  }

  return `${value} h`;
}

export default function CheckinCard({ checkin }) {
  return (
    <View style={styles.card}>
      <Text style={styles.badge}>Chequeo diario</Text>
      <Text style={styles.title}>{formatDate(checkin.checkin_date)}</Text>
      {checkin.general_feeling ? (
        <Text style={styles.description}>{checkin.general_feeling}</Text>
      ) : null}

      <View style={styles.metrics}>
        <Metric label="Dolor" value={`${checkin.pain_level}/10`} />
        <Metric label="Energía" value={`${checkin.energy_level}/10`} />
        <Metric label="Ánimo" value={checkin.mood || "No registrado"} />
        <Metric label="Sueño" value={formatSleepHours(checkin.sleep_hours)} />
      </View>

      {checkin.symptoms_today ? (
        <Text style={styles.text}>Síntomas: {checkin.symptoms_today}</Text>
      ) : null}
      {checkin.personal_notes ? (
        <Text style={styles.text}>Notas: {checkin.personal_notes}</Text>
      ) : null}
    </View>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
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
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    borderRadius: 999,
    color: "#0369A1",
    fontSize: 13,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
  },
  description: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
  },
  metrics: {
    gap: 8,
  },
  metric: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "800",
  },
  text: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
  },
});
