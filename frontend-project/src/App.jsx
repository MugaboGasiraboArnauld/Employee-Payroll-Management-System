import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Login, Register, Dashboard, Employee, Department, Position, Salary, Reports, NotFound } from "./views/pages";
import { Nav, TopBar, ProtectedRoutes } from "./views/components";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/theme.css";

const RegisterRoute = () => <Register />;

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {!isAuthPage && <Nav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />}
      <div className="flex-1 flex flex-col min-w-0">
        {!isAuthPage && <TopBar setMobileOpen={setMobileOpen} />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<RegisterRoute />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employee />} />
              <Route path="/departments" element={<Department />} />
              <Route path="/positions" element={<Position />} />
              <Route path="/salaries" element={<Salary />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </Router>
  );
};

export default App;
