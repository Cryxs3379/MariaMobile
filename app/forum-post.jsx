import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import AppHeader from "../components/AppHeader";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { getAuthErrorMessage, logout } from "../services/authService";
import {
  createComment,
  getPostById,
  likePost,
  unlikePost,
} from "../services/forumService";

function formatDate(value) {
  if (!value) {
    return "Fecha no disponible";
  }

  return new Date(value).toLocaleString();
}

export default function ForumPostScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [error, setError] = useState("");

  async function handleProtectedError(errorToHandle) {
    if (errorToHandle?.response?.status === 401 || errorToHandle?.response?.status === 403) {
      await logout();
      router.replace("/login");
      return true;
    }

    return false;
  }

  async function loadPost() {
    try {
      setError("");
      const data = await getPostById(id);
      setPost(data);
    } catch (loadError) {
      if (await handleProtectedError(loadError)) {
        return;
      }

      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleLike() {
    if (!post) {
      return;
    }

    try {
      setLiking(true);
      if (post.user_has_liked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
      await loadPost();
    } catch (likeError) {
      if (await handleProtectedError(likeError)) {
        return;
      }

      setError(getAuthErrorMessage(likeError));
    } finally {
      setLiking(false);
    }
  }

  async function handleComment() {
    if (!comment.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    try {
      setCommenting(true);
      setError("");
      await createComment(id, { content: comment.trim() });
      setComment("");
      await loadPost();
    } catch (commentError) {
      if (await handleProtectedError(commentError)) {
        return;
      }

      setError(getAuthErrorMessage(commentError));
    } finally {
      setCommenting(false);
    }
  }

  useEffect(() => {
    loadPost();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AppHeader
        title="Detalle del foro"
        subtitle="Lee la publicación y participa con un comentario."
        showBack
        onBack={() => router.replace("/forum")}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2563EB" />
          <Text style={styles.loadingText}>Cargando publicación...</Text>
        </View>
      ) : post ? (
        <>
          <View style={styles.card}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>
            <View style={styles.metaList}>
              <Text style={styles.meta}>Autor: {post.user_name || "Usuario"}</Text>
              {post.disease_name ? (
                <Text style={styles.meta}>Enfermedad: {post.disease_name}</Text>
              ) : null}
              <Text style={styles.meta}>{formatDate(post.created_at)}</Text>
              <Text style={styles.meta}>{post.likes_count || 0} likes</Text>
            </View>
            <PrimaryButton
              title={post.user_has_liked ? "Quitar like" : "Dar like"}
              onPress={handleToggleLike}
              loading={liking}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Añadir comentario</Text>
            <InputField
              label="Comentario"
              value={comment}
              onChangeText={setComment}
              placeholder="A mí también me pasa algo parecido."
            />
            <PrimaryButton title="Comentar" onPress={handleComment} loading={commenting} />
          </View>

          <View style={styles.comments}>
            <Text style={styles.sectionTitle}>Comentarios</Text>
            {post.comments?.length ? (
              post.comments.map((item) => (
                <View key={item.id} style={styles.commentCard}>
                  <Text style={styles.commentAuthor}>{item.user_name || "Usuario"}</Text>
                  <Text style={styles.commentContent}>{item.content}</Text>
                  <Text style={styles.meta}>{formatDate(item.created_at)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.empty}>Todavía no hay comentarios.</Text>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.empty}>No se encontró la publicación.</Text>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    marginBottom: 16,
    padding: 20,
  },
  title: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "900",
  },
  content: {
    color: "#334155",
    fontSize: 16,
    lineHeight: 24,
  },
  metaList: {
    gap: 4,
  },
  meta: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "900",
  },
  comments: {
    gap: 12,
  },
  commentCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  commentAuthor: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
  },
  commentContent: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
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
