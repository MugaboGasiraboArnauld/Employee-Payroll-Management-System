import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex justify-center items-center min-h-screen bg-page">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-content mb-4">404</h1>
      <p className="text-muted mb-6">Page not found</p>
      <Link to="/dashboard" className="btn">Go to Dashboard</Link>
    </div>
  </div>
);

export default NotFound;
