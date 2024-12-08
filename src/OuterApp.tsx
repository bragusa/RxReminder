import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  <Router basename="/rxreminder/">
    <OuterApp />
  </Router>
);

export default AppWrapper;
