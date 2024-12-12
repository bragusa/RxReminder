import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import DateUtility from './Utility/DateUtility.js';
import Calendar from './Components/Calendar/Calendar.js';
import DBAdapter from './DatabaseAdapter.js';
import Wait from './Components/Wait/Wait.js';
import Dialog from './Components/Dialog/Dialog.js';
import signout from './Resources/images/signout.png';
import './App.scss';
const dateResources = DateUtility.getResources();
function App() {
    const dbAdapter = DBAdapter();
    const [working, setWorking] = useState(true);
    const [medicationData, setMedicationData] = useState();
    const [userData, setUserData] = useState();
    const [dialogs, setDialogs] = useState([]);
    const [displayDate, setDisplayDate] = useState(`${new Date().getFullYear()}-${new Date().getMonth()}`);
    const changeDisplayMonth = (month) => {
        const displayDateArray = displayDate === null || displayDate === void 0 ? void 0 : displayDate.split('-');
        if (month >= 12) {
            setDisplayDate(`${parseInt(displayDateArray[0]) + 1}-0`);
        }
        else if (month < 0) {
            setDisplayDate(`${parseInt(displayDateArray[0]) - 1}-11`);
        }
        else {
            setDisplayDate(`${parseInt(displayDateArray[0])}-${month}`);
        }
    };
    const [category, setCategory] = useState('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        //subtract 60000 - 1 minute
        const checkforTimeout = async () => {
            const timeout = sessionStorage.getItem('session_timeout');
            if (timeout) {
                const now = new Date().getTime();
                if (now > parseInt(timeout) - 60000) { //within 1 minute of logout
                    sessionStorage.removeItem('session_timeout');
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    const logout = await dbAdapter.logout();
                    if (logout.status === 'success') {
                        window.location.reload();
                        return;
                    }
                    setWorking(false);
                }
            }
            setTimeout(checkforTimeout, 30000); // 5 minutes
        };
        const fetchData = async () => {
            try {
                checkforTimeout();
                const userData = await dbAdapter.fetchData('users', '');
                setUserData(userData[0]);
                const medicationData = await dbAdapter.fetchData('medications', 'sort asc');
                setCategory(medicationData[0].name);
                setMedicationData(medicationData);
                setWorking(false);
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const medicationIndex = medicationData ? medicationData.findIndex((medication) => medication.name === category) : 0;
    const medication = medicationData ? medicationData[medicationIndex] : {};
    const user = userData ? Object.assign({}, userData) : {};
    document.title = `RxReminder: ${user.name} - ${medication === null || medication === void 0 ? void 0 : medication.name}`;
    const closeDialog = () => {
        const tempDialogs = [...dialogs];
        tempDialogs.pop();
        setDialogs(tempDialogs);
    };
    // const openDialog = (dialog: SimpleDialogProps) => {
    //   setDialogs([...dialogs, ...[{...dialog, close: closeDialog, user: user, index: dialogs.length}]]);
    // };
    const medicationName = medicationData ? medicationData[medicationIndex].name : '';
    const timesPerDay = medicationData ? parseInt(String(medicationData[medicationIndex].timesperday)) : 1;
    const displayMonth = parseInt(displayDate.split('-')[1]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "App", children: [_jsxs("header", { className: "App-header", children: [_jsxs("div", { className: 'Title', children: [_jsx("img", { src: "/rxreminder/favicon.png", style: { width: '2rem' } }), _jsx("div", { children: "RxReminder" })] }), _jsx("div", { style: { justifyContent: 'flex-end' }, children: _jsx("button", { className: 'SignOut', onClick: async () => {
                                        setWorking(true);
                                        setTimeout(async () => {
                                            const logout = await dbAdapter.logout();
                                            if (logout.status === 'success') {
                                                window.location.reload();
                                                return;
                                            }
                                            setWorking(false);
                                        }, 100);
                                    }, children: _jsx("img", { src: signout }) }) }), _jsx("div", { children: _jsxs("div", { children: [_jsx("h4", { children: user === null || user === void 0 ? void 0 : user.name }), _jsxs("div", { style: { fontSize: '3rem' }, children: [_jsx("select", { id: 'category', className: 'App-medication', value: medicationName, onChange: evt => {
                                                        setCategory(evt.currentTarget.value);
                                                    }, children: medicationData === null || medicationData === void 0 ? void 0 : medicationData.map((medication, index) => {
                                                        return _jsx("option", { value: medication.name, children: medication.name }, index);
                                                    }) }), _jsx("div", { style: { fontSize: '1rem' }, children: `( ${timesPerDay} per day )` })] })] }) }), (user === null || user === void 0 ? void 0 : user.name) ? _jsxs("div", { children: [_jsx("button", { onClick: () => {
                                            changeDisplayMonth(displayMonth - 1);
                                        }, children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z", fill: "#000000" }) }) }), _jsx("button", { className: 'App-Today', onClick: evt => { let today = new Date(); setDisplayDate(`${today.getFullYear()}-${today.getMonth()}`); }, children: _jsxs("div", { className: 'Today-icon', children: [_jsx("div", { children: dateResources.months['short'][new Date().getMonth()] }), _jsx("div", { children: new Date().getDate() })] }) }), _jsxs("span", { className: 'App-DateTitle', children: [dateResources.months['long'][parseInt(displayDate.split('-')[1])], " ", displayDate.split('-')[0]] }), _jsx("button", { onClick: () => { changeDisplayMonth(displayMonth + 1); }, children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", style: { transform: 'rotate(180deg)' }, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z", fill: "#000000" }) }) })] }) : null] }), _jsx("div", { className: 'App-body', children: user.name && (medication === null || medication === void 0 ? void 0 : medication.name) ? _jsx(Calendar, { setWorking: setWorking, user: user, medication: category, timesPerDay: timesPerDay, showDate: false, displayDate: displayDate }) : _jsx("div", { style: { height: '730px' } }) })] }), _jsx("div", { children: dialogs.map((dialog, index) => {
                    return _jsx(Dialog, { cancel: null, apply: dialog.apply, user: user, index: index, title: dialog.title, content: dialog.content, close: closeDialog }, dialog.title);
                }) }), _jsx(Wait, { spinner: true, active: working })] }));
}
export default App;
