import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import Login from "./Components/Login/Login";
import App from "./App";
const OuterApp = () => {
    // eslint-disable-next-line no-unused-vars
    const [auth, setAuth] = useState(null);
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
    return (_jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, { setAuth: setAuth }) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(App, {}) }) })] }) }));
};
// Wrap the `OuterApp` with `Router`
const AppWrapper = () => (_jsx(Router, { basename: "/rxreminder", children: _jsx(OuterApp, {}) }));
export default AppWrapper;
