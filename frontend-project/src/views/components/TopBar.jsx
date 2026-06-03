import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { logoutUser } from "../../controllers/authController";

const TopBar = ({ setMobileOpen }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initial = user.username ? user.username.charAt(0).toUpperCase() : "?";

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <header className="bg-card border-b border-color px-4 py-2 flex items-center justify-between gap-3">
      <button onClick={() => setMobileOpen(true)} className="md:hidden icon-btn" aria-label="Open menu">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <span className="badge shrink-0">{initial}</span>
        <span className="text-sm text-content font-medium truncate max-w-[120px]">{user.username || "User"}</span>

        <button onClick={toggleTheme} className="icon-btn shrink-0" aria-label="Toggle theme">
          {theme === "light" ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <button onClick={handleLogout} className="btn btn-logout shrink-0">Logout</button>
      </div>
    </header>
  );
};

export default TopBar;
