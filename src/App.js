import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import DateUtility from './Utility/DateUtility.js';
import Calendar from './Components/Calendar/Calendar.js';
import DBAdapter from './DatabaseAdapter.js';
import Wait from './Components/Wait/Wait.js';
import Dialog from './Components/Dialog/Dialog.js';
import './App.scss';
import EditMedications from './Dialogs/EditMedications/EditMedications.js';
const dateResources = DateUtility.getResources();
function App() {
    const dbAdapter = new DBAdapter();
    const query = new URLSearchParams(window.location.search);
    const [userName] = useState(query.get('user') || 'ttragusa');
    const [password] = useState(query.get('password') || 'loveofmylife');
    const [working, setWorking] = useState(true);
    const [medicationData, setMedicationData] = useState();
    const [userData, setUserData] = useState();
    const [dialogs, setDialogs] = useState([]);
    const today = new Date();
    const [displayYear, setDisplayYear] = useState(today.getFullYear());
    const [displayMonth, setDisplayMonth] = useState(today.getMonth());
    const [category, setCategory] = useState('');
    useEffect(() => {
        if (displayMonth < 0) {
            setDisplayYear(displayYear - 1);
            setDisplayMonth(11);
        }
        if (displayMonth > 11) {
            setDisplayYear(displayYear + 1);
            setDisplayMonth(0);
        }
    }, [displayMonth]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userName || !password) {
                    return;
                }
                const userData = await dbAdapter.fetchData(userName, password, 'users', '');
                setUserData(userData[0]);
                const medicationData = await dbAdapter.fetchData(userName, password, 'medications', 'sort asc');
                if (category === '') {
                    setCategory(medicationData[0].name);
                }
                setMedicationData(medicationData);
                setWorking(false);
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [userName]);
    const firstEditableDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const medicationIndex = medicationData ? medicationData.findIndex((medication) => medication.name === category) : 0;
    const medication = medicationData ? medicationData[medicationIndex] : {};
    const user = userData ? Object.assign({}, userData) : {};
    document.title = `RxReminder: ${user.name} - ${medication === null || medication === void 0 ? void 0 : medication.name}`;
    const closeDialog = () => {
        const tempDialogs = [...dialogs];
        tempDialogs.pop();
        setDialogs(tempDialogs);
    };
    const openDialog = (dialog) => {
        setDialogs([...dialogs, ...[Object.assign(Object.assign({}, dialog), { close: closeDialog, user: user, index: dialogs.length })]]);
    };
    const medicationName = medicationData ? medicationData[medicationIndex].name : '';
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "App", children: [_jsxs("header", { className: "App-header", children: [_jsx("div", { children: _jsxs("div", { children: [user === null || user === void 0 ? void 0 : user.name, (user === null || user === void 0 ? void 0 : user.name) ? _jsxs("div", { children: [_jsx("select", { className: 'App-medication', value: medicationName, onChange: evt => {
                                                        setCategory(evt.currentTarget.value);
                                                    }, children: medicationData === null || medicationData === void 0 ? void 0 : medicationData.map((medication, index) => {
                                                        return _jsx("option", { value: medication.name, children: medication.name }, index);
                                                    }) }), _jsx("button", { className: 'App-edit', onClick: () => {
                                                        openDialog({
                                                            title: 'Edit Medication',
                                                            content: _jsx(EditMedications, { user: user, close: closeDialog })
                                                        });
                                                    }, children: "\u270F\uFE0F" })] }) : !working ? 'No user found. A username must be supplied.' : ''] }) }), (user === null || user === void 0 ? void 0 : user.name) ? _jsxs("div", { children: [_jsx("button", { onClick: () => {
                                            setDisplayMonth(displayMonth - 1);
                                        }, children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z", fill: "#000000" }) }) }), _jsx("button", { className: 'App-Today', onClick: evt => { let today = new Date(); setDisplayMonth(today.getMonth()); setDisplayYear(today.getFullYear()); }, children: "\uD83D\uDCC5" }), _jsxs("span", { className: 'App-DateTitle', children: [dateResources.months['long'][displayMonth], " ", displayYear] }), _jsx("button", { onClick: () => { setDisplayMonth(displayMonth + 1); }, children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", style: { transform: 'rotate(180deg)' }, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z", fill: "#000000" }) }) })] }) : null] }), _jsx("div", { className: 'App-body', children: user.name && (medication === null || medication === void 0 ? void 0 : medication.name) ? _jsx(Calendar, { setWorking: setWorking, user: user, medication: category, showDate: false, displayMonth: displayMonth, displayYear: displayYear, category: category }) : _jsx("div", { style: { height: '730px' } }) })] }), _jsx("div", { children: dialogs.map((dialog, index) => _jsx(Dialog, { user: user, index: index, title: dialog.title, content: dialog.content, close: closeDialog }, index)) }), _jsx(Wait, { spinner: true, active: working })] }));
}
export default App;