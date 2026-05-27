import { api } from "./api";

export async function getPosts() {
  const response = await api.get("/api/forum/posts");
  return response.data.posts || [];
}

export async function createPost(data) {
  const response = await api.post("/api/forum/posts", data);
  return response.data.post;
}

export async function getPostById(id) {
  const response = await api.get(`/api/forum/posts/${id}`);
  return response.data.post;
}

export async function createComment(postId, data) {
  const response = await api.post(`/api/forum/posts/${postId}/comments`, data);
  return response.data.comment;
}

export async function likePost(postId) {
  const response = await api.post(`/api/forum/posts/${postId}/like`);
  return response.data;
}

export async function unlikePost(postId) {
  const response = await api.delete(`/api/forum/posts/${postId}/like`);
  return response.data;
}

export async function deletePost(postId) {
  const response = await api.delete(`/api/forum/posts/${postId}`);
  return response.data;
}

export async function deleteComment(commentId) {
  const response = await api.delete(`/api/forum/comments/${commentId}`);
  return response.data;
}
