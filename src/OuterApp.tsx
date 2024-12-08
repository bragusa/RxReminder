import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import Login from "./Components/Login/Login";
import App from "./App";

const OuterApp: React.FC = () => {
  const [auth, setAuth] = useState<{ username: string; password: string } | null>(null);
  
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={<Login setAuth={setAuth} />}
        />

        {/* Protected Route */}
        <Route
          path="/app"
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
  <Router>
    <OuterApp />
  </Router>
);

export default AppWrapper;
