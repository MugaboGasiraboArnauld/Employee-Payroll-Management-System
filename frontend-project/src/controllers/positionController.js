import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

export const fetchPositions = async () => {
  const res = await api.get("/positions");
  return res.data;
};

export const createPosition = async (data) => {
  const res = await api.post("/positions", data);
  return res.data;
};

export const updatePosition = async (id, data) => {
  const res = await api.put(`/positions/${id}`, data);
  return res.data;
};

export const deletePosition = async (id) => {
  const res = await api.delete(`/positions/${id}`);
  return res.data;
};
