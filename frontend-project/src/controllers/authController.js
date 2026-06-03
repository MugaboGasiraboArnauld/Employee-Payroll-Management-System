import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

export const loginUser = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

export const registerUser = async (username, password) => {
  const res = await api.post("/auth/register", { username, password });
  return res.data;
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (e) {
  }
  localStorage.removeItem("user");
};

export const checkAuth = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const fetchAccount = async () => {
  const res = await api.get("/auth/account");
  return res.data;
};

export const updatePassword = async (currentPassword, newPassword) => {
  const res = await api.put("/auth/account", { currentPassword, newPassword });
  return res.data;
};
