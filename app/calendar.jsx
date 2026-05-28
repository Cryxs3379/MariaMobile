import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import AppHeader from "../components/AppHeader";
import CheckinCard from "../components/CheckinCard";
import EventCard from "../components/EventCard";
import PrimaryButton from "../components/PrimaryButton";
import { getAuthErrorMessage, logout } from "../services/authService";
import { getCheckins } from "../services/checkinsService";
import { getEvents } from "../services/eventsService";

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadCalendarData({ showLoader = false } = {}) {
    try {
      setError("");
      if (showLoader) {
        setRefreshing(true);
      }

      const [eventsData, checkinsData] = await Promise.all([
        getEvents(),
        getCheckins(),
      ]);

      setEvents(eventsData);
      setCheckins(checkinsData);
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

  useEffect(() => {
    loadCalendarData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCalendarData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader
        title="Calendario"
        subtitle="Organiza citas, medicación y recordatorios."
        showBack
        onBack={() => router.replace("/home")}
      />

      <View style={styles.actions}>
        <PrimaryButton title="Añadir evento" onPress={() => router.push("/add-event")} />
        <PrimaryButton
          title="Hacer chequeo diario"
          onPress={() => router.push("/daily-checkin")}
        />
        <PrimaryButton
          title="Actualizar"
          onPress={() => loadCalendarData({ showLoader: true })}
          loading={refreshing}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2563EB" />
          <Text style={styles.loadingText}>Cargando calendario...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Eventos</Text>
          {events.length === 0 ? (
            <Text style={styles.empty}>Todavía no tienes eventos en el calendario.</Text>
          ) : (
            <View style={styles.list}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Chequeos diarios</Text>
          {checkins.length === 0 ? (
            <Text style={styles.empty}>Todavía no tienes chequeos diarios registrados.</Text>
          ) : (
            <View style={styles.list}>
              {checkins.map((checkin) => (
                <CheckinCard key={checkin.id} checkin={checkin} />
              ))}
            </View>
          )}
        </>
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
    marginBottom: 22,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 4,
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
