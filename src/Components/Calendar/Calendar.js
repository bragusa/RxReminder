import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import DateUtility from '../../Utility/DateUtility';
import './Calendar.scss';
import DBTransactions from '../../DatabaseAdapter.js';
// type MarkedDates = {
//   [year: number]: {
//     [month: number]: {
//       [day: number]: {
//         marked: boolean
//       };
//     };
//   };
// };
const Calendar = ({ displayMonth, displayYear, category, user, medication, setWorking, showDate = true }) => {
    const dbTransactions = new DBTransactions();
    const [datesData, setDatesData] = useState();
    // const emptyDates: MarkedDates = {
    //   [displayYear]: {
    //     [displayMonth]: {}
    //   }
    // }; 
    const [storageKey, setStorageKey] = useState(category);
    //const [markedDates, setMarkedDates] = useState<Array<any>>([]);
    const dateResources = DateUtility.getResources();
    useEffect(() => {
        setStorageKey(category);
        const fetchData = async () => {
            try {
                if (!user.username || !medication || !displayMonth || !displayYear) {
                    console.log('Cannot fetch. Missing one of: userName, medication, displayMonth, displayYear');
                    return;
                }
                const datesData = await dbTransactions.fetchData(user.username, user.password, 'dates', 'date asc');
                setDatesData(datesData);
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData(); // Call the function
    }, [user, category]); // Add `userName` as a dependency
    // useEffect(()=>{
    //   const dates = localStorage.getItem(storageKey);
    //   let tempMarkedDates: MarkedDates;
    //   if(dates !== null) {
    //     tempMarkedDates = JSON.parse(dates);
    //     if(!tempMarkedDates[displayYear]){
    //       markedDates[displayYear] = {[displayMonth]: []};
    //     }
    //     setMarkedDates(markedDates);
    //   }
    //   else {
    //     setMarkedDates(emptyDates);
    //   }
    // }, []);
    useEffect(() => {
        // const init = async () =>{
        //   const dates: Array<User> = await dbTransactions.fetchData(user.name, user.password, 'dates');
        //   setMarkedDates(dates);
        // }
        // init();
        // const dates = localStorage.getItem(storageKey);
        // let tempMarkedDates: MarkedDates;
        // if(dates !== null) {
        //   tempMarkedDates = JSON.parse(dates);
        //   if(!tempMarkedDates[displayYear]){
        //     tempMarkedDates[displayYear] = {[displayMonth]: []};
        //   }
        //   else if(!tempMarkedDates[displayYear][displayMonth]){
        //     tempMarkedDates[displayYear][displayMonth] = [];
        //   }
        //   setMarkedDates(tempMarkedDates);
        // }
        // else {
        //   setMarkedDates(emptyDates);
        // }
    }, [user]);
    // useEffect(()=>{
    //   if(markedDates !== emptyDates){
    //     localStorage.setItem(storageKey, JSON.stringify(markedDates));
    //   }
    // }, [markedDates]);
    // useEffect(()=>{
    //   setStorageKey(category);
    // }, [category]);
    // useEffect(()=>{
    //   const dates = localStorage.getItem(storageKey);
    //   let tempMarkedDates: MarkedDates; 
    //   if(dates !== null) {
    //     tempMarkedDates = JSON.parse(dates);
    //     if(!tempMarkedDates[displayYear]){
    //       tempMarkedDates[displayYear] = {[displayMonth]: []};
    //     }
    //     else if(!tempMarkedDates[displayYear][displayMonth]){
    //       tempMarkedDates[displayYear][displayMonth] = [];
    //     }
    //     setMarkedDates(tempMarkedDates);
    //   }
    //   else {
    //     setMarkedDates(emptyDates);
    //   }
    // }, [storageKey]);
    const writeDayHeaders = () => {
        return _jsx("tr", { className: 'Calendar-headers', children: dateResources.days['short'].map((day) => {
                return _jsx("th", { children: _jsx("div", { children: day }) }, `key_${day}`);
            }) });
    };
    const toggleDay = async (date, marked) => {
        setWorking(true);
        const success = await dbTransactions.markDate(user.username, user.password, medication, date, marked ? 0 : 1);
        const datesData = await dbTransactions.fetchData(user.username, user.password, 'dates', 'date asc');
        setDatesData(datesData);
        setWorking(false);
    };
    const writeDay = (firstDayOfTheMonth, day, dayNum, dayOfWeek, markedDates) => {
        let offset = firstDayOfTheMonth.getDay(); //returns day of the week to start
        let displayNum = 0;
        if (dayNum >= offset) {
            displayNum = dayNum + 1 - offset;
            if (displayNum < 1 || displayNum > new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 0).getDate()) {
                displayNum = 0;
            }
        }
        const myDate = displayNum.toString().length > 0 ? new Date(firstDayOfTheMonth).setDate(displayNum) : null;
        const thisDaysDate = new Date();
        const todaysString = `${thisDaysDate.getFullYear()}-${(thisDaysDate.getMonth() + 1).toString().padStart(2, '0')}-${thisDaysDate.getDate().toString().padStart(2, '0')}`;
        const displayDateString = `${firstDayOfTheMonth.getFullYear()}-${(firstDayOfTheMonth.getMonth() + 1).toString().padStart(2, '0')}-${displayNum.toString().padStart(2, '0')}`;
        const currentDateData = markedDates === null || markedDates === void 0 ? void 0 : markedDates.filter(date => {
            const equal = date.date === displayDateString && date.medication === category;
            return equal;
        });
        // next line must be == to compare string and number
        const marked = currentDateData && currentDateData.length > 0 ? currentDateData[0].marked == 1 : false;
        const todaysDate = new Date();
        const today = displayNum === todaysDate.getDate() && displayMonth === todaysDate.getMonth() && displayYear === todaysDate.getFullYear();
        return _jsx("td", { className: today ? 'Calendar-today' : '', "data-marked": marked, onDoubleClick: () => { if (displayNum > 0) {
                toggleDay(displayDateString, marked);
            } }, children: displayNum ? _jsx("button", { className: 'Calendar-day', onClick: (evt) => { if ((today && !marked) || (today && evt.ctrlKey)) {
                    if (displayNum > 0) {
                        toggleDay(displayDateString, marked);
                    }
                } }, children: _jsxs("div", { children: [_jsx("div", { className: 'Calendar-day-number', children: displayNum > 0 ? displayNum : '' }), marked ? _jsx("div", { className: 'Calendar-day-marked', style: { 'transform': `rotate(${displayNum / 2}deg)` }, children: "\u274C" }) : null] }) }) : null }, `key${dayNum}`);
    };
    const writeWeek = (firstDayOfTheMonth, week, monthMarkedDates) => {
        return _jsx("tr", { className: 'Calendar-week', children: dateResources.days.long.map((day, dayOfWeek) => {
                return writeDay(firstDayOfTheMonth, day, dayOfWeek + (week * 7), dayOfWeek, monthMarkedDates);
            }) }, `week_${week}`);
    };
    const writeMonth = (firstDayOfTheMonth, category, monthMarkedDates) => {
        let month = [];
        for (let week = 0; week < 5; week++) {
            month.push(writeWeek(firstDayOfTheMonth, week, monthMarkedDates));
        }
        return month;
    };
    const firstDayOfTheMonth = new Date(displayYear, displayMonth, 1);
    //return markedDates[displayYear] && markedDates[displayYear][displayMonth]?<table className='Calendar-month'>
    return _jsxs("table", { className: 'Calendar-month', children: [showDate ? _jsx("thead", { children: _jsx("tr", { children: _jsxs("th", { colSpan: 7, className: 'Calendar-month-title', children: [dateResources.months['long'][displayMonth], " ", _jsx("small", { children: displayYear })] }) }) }) : null, _jsxs("tbody", { children: [writeDayHeaders(), writeMonth(firstDayOfTheMonth, category, datesData || [])] })] });
    { /* </table>:null; */ }
};
export default Calendar;
