import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

export const fetchDashboardData = async () => {
  const [empRes, depRes, posRes, salRes] = await Promise.all([
    api.get("/employees"),
    api.get("/departments"),
    api.get("/positions"),
    api.get("/salaries"),
  ]);
  return { employees: empRes.data, departments: depRes.data, positions: posRes.data, salaries: salRes.data };
};
