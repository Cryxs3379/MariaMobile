import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Calendar as MonthlyCalendar } from "react-native-calendars";

import AppHeader from "../components/AppHeader";
import CheckinCard from "../components/CheckinCard";
import EventCard from "../components/EventCard";
import PrimaryButton from "../components/PrimaryButton";
import { getAuthErrorMessage, logout } from "../services/authService";
import { getCheckins } from "../services/checkinsService";
import { getEvents } from "../services/eventsService";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function toDateKey(value) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatSelectedDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const markedDates = useMemo(() => {
    const marks = {};

    events.forEach((event) => {
      const dateKey = toDateKey(event.start_date);

      if (!dateKey) {
        return;
      }

      marks[dateKey] = {
        ...(marks[dateKey] || {}),
        dots: [
          ...(marks[dateKey]?.dots || []),
          { key: `event-${event.id}`, color: "#2563EB" },
        ],
      };
    });

    checkins.forEach((checkin) => {
      const dateKey = toDateKey(checkin.checkin_date);

      if (!dateKey) {
        return;
      }

      marks[dateKey] = {
        ...(marks[dateKey] || {}),
        dots: [
          ...(marks[dateKey]?.dots || []),
          { key: `checkin-${checkin.id}`, color: "#16A34A" },
        ],
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#2563EB",
    };

    return marks;
  }, [checkins, events, selectedDate]);

  const selectedEvents = useMemo(
    () => events.filter((event) => toDateKey(event.start_date) === selectedDate),
    [events, selectedDate]
  );

  const selectedCheckin = useMemo(
    () => checkins.find((checkin) => toDateKey(checkin.checkin_date) === selectedDate),
    [checkins, selectedDate]
  );

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
          <View style={styles.calendarCard}>
            <MonthlyCalendar
              markingType="multi-dot"
              markedDates={markedDates}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              firstDay={1}
              theme={{
                arrowColor: "#2563EB",
                calendarBackground: "#FFFFFF",
                dayTextColor: "#0F172A",
                monthTextColor: "#0F172A",
                selectedDayBackgroundColor: "#2563EB",
                selectedDayTextColor: "#FFFFFF",
                textDisabledColor: "#CBD5E1",
                textMonthFontWeight: "900",
                textDayFontWeight: "700",
                todayTextColor: "#2563EB",
              }}
            />

            <View style={styles.legend}>
              <LegendItem color="#2563EB" label="Evento" />
              <LegendItem color="#16A34A" label="Chequeo diario" />
            </View>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Detalle del día</Text>
            <Text style={styles.selectedDate}>{formatSelectedDate(selectedDate)}</Text>

            {selectedEvents.length === 0 && !selectedCheckin ? (
              <Text style={styles.empty}>Este día no tiene eventos ni chequeo diario.</Text>
            ) : null}

            {selectedEvents.length > 0 ? (
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Eventos de este día</Text>
                <View style={styles.list}>
                  {selectedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </View>
              </View>
            ) : null}

            {selectedCheckin ? (
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Chequeo diario</Text>
                <CheckinCard checkin={selectedCheckin} />
              </View>
            ) : null}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
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
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 18,
    overflow: "hidden",
    padding: 12,
  },
  legend: {
    borderTopColor: "#E2E8F0",
    borderTopWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 12,
    padding: 14,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  legendDot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  legendText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "800",
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  detailSection: {
    gap: 12,
  },
  detailTitle: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "900",
  },
  list: {
    gap: 14,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
  },
  selectedDate: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "800",
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
