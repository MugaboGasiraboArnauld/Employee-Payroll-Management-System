import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

export const fetchEmployees = async () => {
  const res = await api.get("/employees");
  return res.data;
};

export const fetchDepartments = async () => {
  const res = await api.get("/departments");
  return res.data;
};

export const fetchPositions = async () => {
  const res = await api.get("/positions");
  return res.data;
};

export const createEmployee = async (data) => {
  const res = await api.post("/employees", data);
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await api.put(`/employees/${id}`, data);
  return res.data;
};

export const deleteEmployee = async (id) => {
  const res = await api.delete(`/employees/${id}`);
  return res.data;
};
