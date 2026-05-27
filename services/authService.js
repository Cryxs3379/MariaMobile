import { api, setAuthToken } from "./api";
import {
  clearAuthStorage,
  getToken,
  saveToken,
  saveUser,
} from "../storage/authStorage";

function extractUser(responseData) {
  return responseData?.user ?? responseData;
}

export function getAuthErrorMessage(error) {
  if (error?.code === "ECONNABORTED") {
    return "Tiempo de espera agotado. Inténtalo de nuevo.";
  }

  if (!error?.response) {
    return "No se pudo conectar con el servidor.";
  }

  if (error.response.status === 401 || error.response.status === 403) {
    return "Credenciales incorrectas.";
  }

  if (error.response.status >= 500) {
    return "El servidor no está disponible en este momento.";
  }

  return "Ocurrió un error inesperado.";
}

export async function login(email, password) {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error("Respuesta de login inválida.");
    }

    await saveToken(token);
    await saveUser(user);
    setAuthToken(token);

    return { token, user };
  } catch (error) {
    if (error.message === "Respuesta de login inválida.") {
      throw new Error("Ocurrió un error inesperado.");
    }

    throw new Error(getAuthErrorMessage(error));
  }
}

export async function getMe() {
  const response = await api.get("/api/users/me");
  return extractUser(response.data);
}

export async function logout() {
  await clearAuthStorage();
  setAuthToken(null);
}

export async function restoreSession() {
  const token = await getToken();

  if (!token) {
    setAuthToken(null);
    return null;
  }

  try {
    setAuthToken(token);
    const user = await getMe();
    await saveUser(user);
    return user;
  } catch {
    await logout();
    return null;
  }
}
