import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

export const fetchSalaries = async () => {
  const res = await api.get("/salaries");
  return res.data;
};

export const createSalary = async (data) => {
  const res = await api.post("/salaries", data);
  return res.data;
};

export const updateSalary = async (id, data) => {
  const res = await api.put(`/salaries/${id}`, data);
  return res.data;
};

export const deleteSalary = async (id) => {
  const res = await api.delete(`/salaries/${id}`);
  return res.data;
};
