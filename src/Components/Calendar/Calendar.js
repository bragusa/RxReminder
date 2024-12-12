import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import DateUtility from '../../Utility/DateUtility';
import './Calendar.scss';
import DBAdapter from '../../DatabaseAdapter.js';
const Calendar = ({ /*displayMonth, displayYear*/ displayDate, user, medication, setWorking, showDate = true, timesPerDay }) => {
    const [dbAdapter] = useState(DBAdapter(setWorking));
    const [datesData, setDatesData] = useState();
    const dateResources = DateUtility.getResources();
    useEffect(() => {
        const fetchData = async () => {
            if (!user.username || !medication) { //} || displayMonth || !displayYear) {
                console.log('Cannot fetch. Missing one of: userName, medication, displayMonth, displayYear');
                return;
            }
            const displayYear = parseInt(displayDate.split('-')[0]);
            const displayMonth = parseInt(displayDate.split('-')[1]);
            try {
                const datesData = await dbAdapter.fetchMonthDates(`${displayYear}-${displayMonth + 1}-01`, medication);
                setDatesData(datesData);
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [user.username, displayDate, medication]); // eslint-disable-line react-hooks/exhaustive-deps
    const writeDayHeaders = () => {
        return _jsx("tr", { className: 'Calendar-headers', children: dateResources.days['short'].map((day) => {
                return _jsx("th", { children: _jsx("div", { children: day }) }, `key_${day}`);
            }) });
    };
    const toggleDay = async (date, timesPerDay, marked) => {
        const waitLayerTimeoutId = setTimeout(() => {
            if (setWorking) {
                setWorking(true); // Show the wait layer
            }
        }, 500);
        let [year, month, day] = date.split('-').map(part => +part);
        if (month <= 0) {
            year--;
            month = 12;
        }
        else if (month > 12) {
            year++;
            month = 0;
        }
        if (timesPerDay > 1) {
            marked = marked + 1;
            if (marked > timesPerDay) {
                marked = 0;
            }
        }
        else {
            marked = marked === 0 ? 1 : 0;
        }
        const newDatesData = await dbAdapter.markDate(medication, `${year}-${(month).toString().padStart(2, '0')}-${(day).toString().padStart(2, '0')}`, marked, false);
        if (JSON.stringify(newDatesData) !== JSON.stringify(datesData)) {
            setDatesData(newDatesData);
        }
        clearTimeout(waitLayerTimeoutId);
        setWorking(false);
    };
    const adjustForOtherMonths = (displayNum, offset, firstDayOfTheMonth, day, dayNum, dayOfWeek) => {
        const daysInMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 0).getDate();
        let differentMonth = displayNum > daysInMonth || displayNum <= 0;
        let month = firstDayOfTheMonth.getMonth() + 1;
        let year = displayYear;
        if (displayNum > daysInMonth) {
            displayNum = displayNum - daysInMonth;
            month = month + 1;
            if (month === 13) {
                month = 1;
                year++;
            }
        }
        else if (displayNum <= 0) {
            month--;
            if (month === 0) {
                month = 12;
                year--;
            }
            displayNum = new Date(year, month, 0).getDate() + displayNum;
        }
        return {
            displayDateString: `${year}-${(month).toString().padStart(2, '0')}-${displayNum.toString().padStart(2, '0')}`,
            differentMonth: differentMonth,
            month: month,
            year: year,
            displayNum: displayNum
        };
    };
    const writeDay = (firstDayOfTheMonth, day, dayNum, dayOfWeek, markedDates) => {
        const offset = firstDayOfTheMonth.getDay(); //returns day of the week to start
        let displayNum = dayNum + 1 - offset;
        const adjustedForOtherMonths = adjustForOtherMonths(displayNum, offset, firstDayOfTheMonth, day, dayNum, dayOfWeek);
        const displayDateString = adjustedForOtherMonths.displayDateString;
        displayNum = adjustedForOtherMonths.displayNum;
        const currentDateData = markedDates === null || markedDates === void 0 ? void 0 : markedDates.filter(date => {
            const equal = date.date === displayDateString && date.medication === medication;
            return equal;
        });
        // next line must be == to compare string and number
        const marked = currentDateData && currentDateData.length > 0 ? parseInt(String(currentDateData[0].marked)) : 0;
        const todaysDate = new Date();
        const today = displayNum === todaysDate.getDate() && displayMonth === todaysDate.getMonth() && displayYear === todaysDate.getFullYear();
        const futureDate = new Date(adjustedForOtherMonths.displayDateString) > todaysDate;
        return _jsx("td", { className: today ? 'Calendar-today' : '', "data-marked": marked, id: displayDateString, children: _jsx("button", { "data-per-day": timesPerDay, className: 'Calendar-day', disabled: !displayNum || futureDate, onKeyUp: (evt) => {
                    if (['Enter', ' '].includes(evt.key) && displayNum > 0) {
                        toggleDay(displayDateString, timesPerDay, marked);
                    }
                }, onDoubleClick: (evt) => { if (displayNum > 0) {
                    evt.currentTarget.setAttribute('data-changed', 'true');
                    toggleDay(displayDateString, timesPerDay, marked);
                } }, onClick: (evt) => { if (evt.ctrlKey || (today && !marked) || (today && timesPerDay > 1)) {
                    if (displayNum > 0) {
                        evt.currentTarget.setAttribute('data-changed', 'true');
                        toggleDay(displayDateString, timesPerDay, marked);
                    }
                } }, children: _jsxs("div", { className: adjustedForOtherMonths.differentMonth ? 'Different-month' : '', children: [_jsx("div", { className: 'Calendar-day-number', children: displayNum > 0 ? displayNum : '' }), (timesPerDay === 1 || today || marked >= 1) && (_jsx("div", { className: 'TimesTaken', children: Array.from({ length: timesPerDay }).map((_, index) => {
                                return _jsx("div", { className: marked > 0 && marked > index ? 'Taken imageRotateHorizontal' : 'NotTaken', id: `${displayDateString}_${index}`, children: timesPerDay > 1 ? index + 1 : '' }, `${displayDateString}_${index}`);
                            }) }))] }) }) }, `${displayDateString}`);
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
    const displayYear = parseInt(displayDate.split('-')[0]);
    const displayMonth = parseInt(displayDate.split('-')[1]);
    const firstDayOfTheMonth = new Date(displayYear, displayMonth, 1);
    // <KeyNavigation>
    return _jsxs("table", { className: 'Calendar-month', children: [showDate ? _jsx("thead", { children: _jsx("tr", { children: _jsxs("th", { colSpan: 7, className: 'Calendar-month-title', children: [dateResources.months['long'][displayMonth], " ", _jsx("small", { children: displayYear })] }) }) }) : null, _jsxs("tbody", { children: [writeDayHeaders(), writeMonth(firstDayOfTheMonth, datesData || [])] })] });
};
export default Calendar;
