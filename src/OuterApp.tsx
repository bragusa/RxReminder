import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import Login from "./Components/Login/Login";
import App from "./App";

const OuterApp: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const [auth, setAuth] = useState<{ username: string;} | null>(null);
  
  useEffect(() => {
    // Listen for visibility change events
    const handleVisibilityChange = () => {
      const channel = new BroadcastChannel('app-channel');
      channel.postMessage({ type: 'APP_ACTIVE' });
      channel.close(); // Close the channel after sending the message 

    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={<Login setAuth={setAuth} />}
        />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

// Wrap the `OuterApp` with `Router`
const AppWrapper: React.FC = () => (
  <Router basename="/rxreminder">
    <OuterApp />
  </Router>
);

export default AppWrapper;
