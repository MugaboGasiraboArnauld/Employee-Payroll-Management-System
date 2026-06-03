import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

export const fetchReportData = async () => {
  const [salRes, empRes, depRes, posRes] = await Promise.all([
    api.get("/salaries"),
    api.get("/employees"),
    api.get("/departments"),
    api.get("/positions"),
  ]);
  return { salaries: salRes.data, employees: empRes.data, departments: depRes.data, positions: posRes.data };
};

export const fetchEmployeesOnLeave = async () => {
  const res = await api.get("/reports/employees-on-leave");
  return res.data;
};
