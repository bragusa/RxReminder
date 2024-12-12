import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import DBAdapter from '../../DatabaseAdapter';
import './Login.scss';
import Wait from '../Wait/Wait';
import EyeShow from '../../Resources/images/eye-password-show.svg';
import EyeHide from '../../Resources/images/eye-password-hide.svg';
const Login = ({ setAuth }) => {
    const { setIsAuthorized } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const loginForm = useRef(null);
    const navigate = useNavigate(); // Hook for navigation
    const dbAdapter = DBAdapter();
    const [working, setWorking] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(Object.assign(Object.assign({}, formData), { [name]: value }));
    };
    const navigateToApp = (expiration) => {
        setIsAuthorized(true); // Save auth data to context
        if (expiration) {
            sessionStorage.setItem('session_timeout', expiration + '');
        }
        navigate('/');
    };
    const checkForCookie = async () => {
        setWorking(true);
        setTimeout(async () => {
            const auth = await dbAdapter.checkForCookie();
            if (auth.status === 'success') {
                navigateToApp(null);
                return;
            }
            setWorking(false);
            if (loginForm.current) {
                loginForm.current.style.opacity = '1';
            }
        }, 500);
    };
    useEffect(() => {
        const auth = checkForCookie();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;
        if (!username || !password) {
            //setErrorMessage('Both fields are required.');
            return;
        }
        const auth = await dbAdapter.authenticateUser(username, password);
        if (auth.status === 'failed') {
            setErrorMessage('Invalid username or password.');
            return;
        }
        navigateToApp(auth.expires);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: 'Login-background' }), _jsxs("div", { className: 'Login', ref: loginForm, children: [_jsx("h2", { children: "Welcome to RxReminder." }), _jsx("h4", { className: 'Login-heading', children: "Please enter your login credentials." }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: 'text', name: 'username', placeholder: 'Username', value: formData.username, onChange: handleChange, autoCapitalize: 'off', autoComplete: 'username', maxLength: 12 }), _jsxs("div", { className: 'Login-password', children: [_jsx("input", { type: showPassword ? 'text' : 'password', name: 'password', placeholder: 'Password', value: formData.password, onChange: handleChange, maxLength: 12 }), _jsx("button", { style: { visibility: 'hidden', height: '1px' }, type: 'submit', children: "Login" }), _jsx("button", { className: 'Eye', onClick: (evt) => { evt.preventDefault(); setShowPassword(prev => !prev); }, children: _jsx("img", { src: showPassword ? EyeHide : EyeShow }) })] }), _jsx("button", { style: { float: 'left' }, type: 'submit', children: "Login" })] }), errorMessage && _jsx("p", { className: 'Error', style: { color: 'red' }, children: errorMessage })] }), _jsx(Wait, { spinner: true, active: working })] }));
};
export default Login;
