import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
}) {
  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  }

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    borderRadius: 999,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
});
