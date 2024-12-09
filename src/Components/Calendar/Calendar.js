import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import DateUtility from '../../Utility/DateUtility';
import './Calendar.scss';
import DBAdapter from '../../DatabaseAdapter.js';
const Calendar = ({ displayMonth, displayYear, user, medication, setWorking, showDate = true, timesPerDay }) => {
    const dbTransactions = DBAdapter();
    const [datesData, setDatesData] = useState();
    const dateResources = DateUtility.getResources();
    useEffect(() => {
        const fetchData = async () => {
            if (!user.username || !medication || !displayMonth || !displayYear) {
                console.log('Cannot fetch. Missing one of: userName, medication, displayMonth, displayYear');
                return;
            }
            try {
                const datesData = await dbTransactions.fetchData('dates', 'date asc');
                setDatesData(datesData);
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [user.username, medication, displayMonth, displayYear]);
    const writeDayHeaders = () => {
        return _jsx("tr", { className: 'Calendar-headers', children: dateResources.days['short'].map((day) => {
                return _jsx("th", { children: _jsx("div", { children: day }) }, `key_${day}`);
            }) });
    };
    const toggleDay = async (date, timesPerDay, marked) => {
        setWorking(true);
        if (timesPerDay > 1) {
            marked = marked + 1;
            if (marked > timesPerDay) {
                marked = 0;
            }
        }
        else {
            marked = marked === 0 ? 1 : 0;
        }
        const success = await dbTransactions.markDate(medication, date, marked);
        const newDatesData = await dbTransactions.fetchData('dates', 'date asc');
        // Only update if new data differs
        if (JSON.stringify(newDatesData) !== JSON.stringify(datesData)) {
            setDatesData(newDatesData);
        }
        setWorking(false);
    };
    const writeDay = (firstDayOfTheMonth, day, dayNum, dayOfWeek, markedDates) => {
        let offset = firstDayOfTheMonth.getDay(); //returns day of the week to start
        let displayNum = 0;
        //if (dayNum >= offset) {
        displayNum = dayNum + 1 - offset;
        if (displayNum < 1) {
            displayNum = 0;
        }
        const daysInMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 0).getDate();
        // if(displayNum > daysInMonth) {
        //   debugger;
        //   displayNum = displayNum - daysInMonth;
        // }
        //}
        const myDate = displayNum.toString().length > 0 ? new Date(firstDayOfTheMonth).setDate(displayNum) : null;
        const thisDaysDate = new Date();
        const todaysString = `${thisDaysDate.getFullYear()}-${(thisDaysDate.getMonth() + 1).toString().padStart(2, '0')}-${thisDaysDate.getDate().toString().padStart(2, '0')}`;
        let month = firstDayOfTheMonth.getMonth() + 1;
        let displayDateString = `${firstDayOfTheMonth.getFullYear()}-${(month).toString().padStart(2, '0')}-${displayNum.toString().padStart(2, '0')}`;
        if (displayNum > daysInMonth) {
            displayNum = displayNum - daysInMonth;
            month = month + 1;
            let year = displayYear;
            if (month === 12) {
                month = 1;
                year++;
            }
            displayDateString = `${year}-${(month).toString().padStart(2, '0')}-${displayNum.toString().padStart(2, '0')}`;
        }
        const currentDateData = markedDates === null || markedDates === void 0 ? void 0 : markedDates.filter(date => {
            const equal = date.date === displayDateString && date.medication === medication;
            return equal;
        });
        // next line must be == to compare string and number
        const marked = currentDateData && currentDateData.length > 0 ? parseInt(String(currentDateData[0].marked)) : 0;
        const todaysDate = new Date();
        const today = displayNum === todaysDate.getDate() && displayMonth === todaysDate.getMonth() && displayYear === todaysDate.getFullYear();
        return _jsx("td", { className: today ? 'Calendar-today' : '', "data-marked": marked, onDoubleClick: () => { if (displayNum > 0) {
                ;
                toggleDay(displayDateString, timesPerDay, marked);
            } }, children: _jsx("button", { "data-per-day": timesPerDay, className: 'Calendar-day', disabled: !displayNum, onKeyUp: (evt) => {
                    if (['Enter', ' '].includes(evt.key) && displayNum > 0) {
                        toggleDay(displayDateString, timesPerDay, marked);
                    }
                }, onClick: (evt) => { if (evt.ctrlKey || (today && !marked) || (today && timesPerDay > 1)) {
                    if (displayNum > 0) {
                        toggleDay(displayDateString, timesPerDay, marked);
                    }
                } }, children: _jsxs("div", { className: displayNum === 0 ? 'Different-month' : '', children: [_jsx("div", { className: 'Calendar-day-number', children: displayNum > 0 ? displayNum : '' }), timesPerDay > 1 && (today || marked >= 1) && (_jsx("div", { className: 'TimesTaken', children: Array.from({ length: timesPerDay }).map((_, index) => {
                                return _jsx("div", { className: marked > index ? 'Taken' : 'NotTaken', children: index + 1 }, index);
                            }) })), marked > 0 && timesPerDay === marked && timesPerDay === 1 ? _jsx("div", { className: 'Calendar-day-marked', style: { 'transform': `rotate(${displayNum / 2}deg)` }, children: "\u274C" }) : null] }) }) }, `key${dayNum}`);
    };
    const writeWeek = (firstDayOfTheMonth, week, monthMarkedDates) => {
        return _jsx("tr", { className: 'Calendar-week', children: dateResources.days.long.map((day, dayOfWeek) => {
                return writeDay(firstDayOfTheMonth, day, dayOfWeek + (week * 7), dayOfWeek, monthMarkedDates);
            }) }, `week_${week}`);
    };
    const writeMonth = (firstDayOfTheMonth, monthMarkedDates) => {
        let month = [];
        for (let week = 0; week < 5; week++) {
            month.push(writeWeek(firstDayOfTheMonth, week, monthMarkedDates));
        }
        return month;
    };
    const firstDayOfTheMonth = new Date(displayYear, displayMonth, 1);
    // <KeyNavigation>
    return _jsxs("table", { className: 'Calendar-month', children: [showDate ? _jsx("thead", { children: _jsx("tr", { children: _jsxs("th", { colSpan: 7, className: 'Calendar-month-title', children: [dateResources.months['long'][displayMonth], " ", _jsx("small", { children: displayYear })] }) }) }) : null, _jsxs("tbody", { children: [writeDayHeaders(), writeMonth(firstDayOfTheMonth, datesData || [])] })] });
};
export default Calendar;
