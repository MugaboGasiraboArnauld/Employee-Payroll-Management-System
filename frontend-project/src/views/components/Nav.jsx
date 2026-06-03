import React from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/employees", label: "Employees" },
    { path: "/departments", label: "Departments" },
    { path: "/positions", label: "Positions" },
    { path: "/salaries", label: "Salaries" },
    { path: "/reports", label: "Reports" },
    { path: "/account", label: "Account" },
  ];

  const navContent = (
    <>
      <div className="p-4 border-b border-color flex items-center gap-2">
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="currentColor"/>
          <text x="16" y="21" textAnchor="middle" fill="var(--bg)" fontSize="16" fontWeight="bold" fontFamily="Arial">H</text>
        </svg>
        <Link to="/dashboard" className="font-bold text-lg text-content">HRMS</Link>
      </div>
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} onClick={() => setMobileOpen && setMobileOpen(false)} className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-48 lg:w-56 bg-card border-r border-color flex-col h-screen sticky top-0">{navContent}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-card h-screen flex flex-col border-r border-color animate-slide-up">{navContent}</aside>
        </div>
      )}
    </>
  );
};

export default Nav;
