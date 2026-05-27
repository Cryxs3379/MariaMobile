import { StyleSheet, Text, View } from "react-native";

function formatDate(value) {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleString();
}

export default function EventCard({ event }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.type}>{event.event_type}</Text>
      {event.description ? <Text style={styles.description}>{event.description}</Text> : null}
      <Text style={styles.date}>Inicio: {formatDate(event.start_date)}</Text>
      {event.end_date ? (
        <Text style={styles.date}>Fin: {formatDate(event.end_date)}</Text>
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
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
  },
  type: {
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    color: "#166534",
    fontSize: 13,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  description: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
  },
  date: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },
});
