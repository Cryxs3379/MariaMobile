import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 18,
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
