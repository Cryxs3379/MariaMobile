import { Pressable, StyleSheet, Text, View } from "react-native";

function formatDate(value) {
  if (!value) {
    return "Fecha no disponible";
  }

  return new Date(value).toLocaleString();
}

function summarize(text) {
  if (!text || text.length <= 120) {
    return text;
  }

  return `${text.slice(0, 120)}...`;
}

export default function PostCard({ post, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{summarize(post.content)}</Text>
      <View style={styles.metaList}>
        <Text style={styles.meta}>Autor: {post.user_name || "Usuario"}</Text>
        {post.disease_name ? (
          <Text style={styles.meta}>Enfermedad: {post.disease_name}</Text>
        ) : null}
        <Text style={styles.meta}>
          {post.comments_count || 0} comentarios · {post.likes_count || 0} likes
        </Text>
        <Text style={styles.meta}>{formatDate(post.created_at)}</Text>
      </View>
    </Pressable>
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
  content: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
  },
  metaList: {
    gap: 4,
  },
  meta: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
  },
});
