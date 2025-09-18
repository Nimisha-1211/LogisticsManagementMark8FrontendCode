import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/admin/Settings.css";

const Settings = () => {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Toastify handlers
  const handleExport = () => toast.success("✅ Data exported (mock)");
  const handleImport = () => toast.info("📦 Products imported (mock)");
  const handleBackup = () => toast.success("💾 Backup completed (mock)");
  const handleChangePassword = () => toast.warn("🔑 Password change triggered (mock)");
  const handle2FA = () => toast.success("🔒 Two-Factor Authentication enabled (mock)");
  const handleLoginHistory = () => toast.info("📜 Viewing login history (mock)");

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h4>Warehouse Manager</h4>
        <ul>
          <li><Link to="/warehouse-dashboard">Dashboard</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/assign-driver">Assign Driver</Link></li>
          
          <li><Link to="/settings">Settings</Link></li>
          
          <li><Link to="/logout" className="logout-link">Logout</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content">
        <h2>Settings</h2>

        {/* User Settings */}
        <div className="settings-card">
          <h3>User Settings</h3>
          <div className="settings-option">
            <span>Enable Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => {
                setNotifications(!notifications);
                toast.info(`Notifications ${!notifications ? "enabled" : "disabled"}`);
              }}
            />
          </div>
          <div className="settings-option">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => {
                setDarkMode(!darkMode);
                toast.info(`Dark mode ${!darkMode ? "enabled" : "disabled"}`);
              }}
            />
          </div>
          <div className="settings-option">
            <span>Auto Refresh Dashboard</span>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={() => {
                setAutoRefresh(!autoRefresh);
                toast.info(`Auto-refresh ${!autoRefresh ? "enabled" : "disabled"}`);
              }}
            />
          </div>
        </div>

        {/* Security */}
        <div className="settings-card">
          <h3>Security</h3>
          <button onClick={handleChangePassword}>Change Password</button>
          <button onClick={handle2FA}>Enable Two-Factor Authentication</button>
          <button onClick={handleLoginHistory}>View Login History</button>
        </div>

        {/* Data Management */}
        <div className="settings-card">
          <h3>Data Management</h3>
          <button onClick={handleExport} className="primary">Export Data</button>
          <button onClick={handleImport}>Import Products</button>
          <button onClick={handleBackup}>Backup Settings</button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
    </div>
  );
};

export default Settings;