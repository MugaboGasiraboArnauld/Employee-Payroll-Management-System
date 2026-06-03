import React, { useState, useEffect } from "react";
import { fetchAccount, updatePassword } from "../../controllers/authController";

const Account = () => {
  const [account, setAccount] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchAccount()
      .then((res) => setAccount(res))
      .catch(() => setNotification({ message: "Failed to load account!", type: "error" }));
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match!", "error");
      return;
    }
    if (newPassword.length < 6) {
      showNotification("Password must be at least 6 characters!", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await updatePassword(currentPassword, newPassword);
      showNotification(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update password!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-page p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {notification && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${notification.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {notification.message}
            <button className="float-right font-bold" onClick={() => setNotification(null)}>X</button>
          </div>
        )}

        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-content mb-1">Account Management</h1>
          <p className="text-muted mb-6">View account details and change password</p>
        </div>

        {account && (
          <div className="card mb-6 animate-slide-up">
            <h2 className="text-lg font-bold text-content mb-4">Account Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                <span className="text-sm text-muted">Username</span>
                <span className="text-sm font-medium text-content">{account.username}</span>
              </div>
              {account.employee && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                  <span className="text-sm text-muted">Employee</span>
                  <span className="text-sm font-medium text-content">{account.employee}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 rounded-lg bg-hover">
                <span className="text-sm text-muted">Created</span>
                <span className="text-sm font-medium text-content">{new Date(account.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card animate-slide-up">
          <h2 className="text-lg font-bold text-content mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="input-field" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="input-field" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="input-field" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="text-center">
              <button type="submit" className="btn" disabled={loading}>{loading ? "Updating..." : "Update Password"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;