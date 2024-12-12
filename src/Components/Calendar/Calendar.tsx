import React, { useEffect, useState} from 'react';
import DateUtility from '../../Utility/DateUtility';
import './Calendar.scss';
import DBAdapter from '../../DatabaseAdapter.js';
import KeyNavigation from '../KeyNavigation/KeyNavigation.js';

interface User {
  username: string;
  name: string;
}

interface Props  {
  user: User,
  medication: string,
  showDate: boolean,
  displayDate: string,
  // displayMonth: number;
  // displayYear: number;
  setWorking(working: boolean): void;
  timesPerDay: number;
}

interface Dates {
  username: string,
  medication: string,
  date: string,
  marked: number
}

const Calendar: React.FC<Props> = ({ /*displayMonth, displayYear*/ displayDate, user, medication, setWorking, showDate = true, timesPerDay }) => {

  const [dbAdapter] = useState(DBAdapter(setWorking));

  const [datesData, setDatesData] = useState<Array<Dates>>();

  const dateResources = DateUtility.getResources();

  useEffect(() => {
    const fetchData = async () => {
      if (!user.username || !medication){//} || displayMonth || !displayYear) {
        console.log('Cannot fetch. Missing one of: userName, medication, displayMonth, displayYear');
        return;
      }
      const displayYear = parseInt(displayDate.split('-')[0]);
      const displayMonth = parseInt(displayDate.split('-')[1]);
      try {
        const datesData: Array<Dates> = await dbAdapter.fetchMonthDates(`${displayYear}-${displayMonth+1}-01`, medication);
        setDatesData(datesData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  
    fetchData();
  }, [user.username, displayDate, medication]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const writeDayHeaders = () => {
    return <tr className='Calendar-headers'>
      {dateResources.days['short'].map((day) => {
        return <th key={`key_${day}`}><div>{day}</div></th>;
      })}
    </tr>
  }

  const toggleDay = async(date: string, timesPerDay: number, marked: number) => {
    const waitLayerTimeoutId = setTimeout(() => {
      if (setWorking) {
        setWorking(true); // Show the wait layer
      }
    }, 500);

    let [year, month, day] = date.split('-').map(part => +part);
    
    if(month<=0){
      year--;
      month = 12;
    }
    else if(month>12){
      year++;
      month=0;
    }

    if(timesPerDay>1){
      marked = marked + 1;
      if(marked>timesPerDay){
        marked = 0;
      }
    }
    else {
      marked = marked===0?1:0;
    }

    const newDatesData = await dbAdapter.markDate(medication, `${year}-${(month).toString().padStart(2, '0')}-${(day).toString().padStart(2, '0')}`, marked, false);

    if (JSON.stringify(newDatesData) !== JSON.stringify(datesData)) {
      setDatesData(newDatesData);
    }
    
    clearTimeout(waitLayerTimeoutId); 
    setWorking(false);
  }


  const adjustForOtherMonths = (displayNum: number, offset: number, firstDayOfTheMonth: Date, day: string, dayNum: number, dayOfWeek: number)=>{
    const daysInMonth =  new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 0).getDate();
    let differentMonth = displayNum > daysInMonth || displayNum <=0;
    let month = firstDayOfTheMonth.getMonth()+1;
    let year = displayYear;
    if(displayNum > daysInMonth){
      displayNum = displayNum - daysInMonth;
      month = month + 1;
      if(month===13){
        month = 1;
        year++;
      }
      
    } else if(displayNum <=0){
      month--;
      if(month===0){
        month = 12;
        year--;
      }
      displayNum = new Date(year,month,0).getDate() + displayNum;
    }
    return {
      displayDateString: `${year}-${(month).toString().padStart(2, '0')}-${displayNum.toString().padStart(2, '0')}`, 
      differentMonth: differentMonth, 
      month: month, 
      year: year, 
      displayNum: displayNum
    };
  }


  const writeDay = (firstDayOfTheMonth: Date, day: string, dayNum: number, dayOfWeek: number, markedDates: Array<Dates>) => {
    const offset = firstDayOfTheMonth.getDay(); //returns day of the week to start
    let displayNum = dayNum + 1 - offset;
    const adjustedForOtherMonths = adjustForOtherMonths(displayNum, offset, firstDayOfTheMonth, day, dayNum, dayOfWeek);
    const displayDateString = adjustedForOtherMonths.displayDateString;
    displayNum = adjustedForOtherMonths.displayNum;
    const currentDateData = markedDates?.filter(date=> {
      const equal = date.date===displayDateString && date.medication === medication;
      return equal
    });
    // next line must be == to compare string and number
    const marked = currentDateData && currentDateData.length>0 ? parseInt(String(currentDateData[0].marked)) : 0;

    const todaysDate = new Date();
    const today = displayNum === todaysDate.getDate() && displayMonth === todaysDate.getMonth() && displayYear === todaysDate.getFullYear();
    const futureDate = new Date(adjustedForOtherMonths.displayDateString) > todaysDate;

    return <td className={today?'Calendar-today':''} data-marked={marked} key={`${displayDateString}`} id={displayDateString} >
      <button data-per-day={timesPerDay} className='Calendar-day' disabled={!displayNum || futureDate} onKeyUp={(evt)=>{
        if(['Enter', ' '].includes(evt.key) && displayNum>0){toggleDay(displayDateString, timesPerDay, marked);}
      }} onDoubleClick={(evt)=>{if(displayNum>0){evt.currentTarget.setAttribute('data-changed','true');toggleDay(displayDateString, timesPerDay, marked)}}} onClick={(evt)=>{if(evt.ctrlKey || (today && !marked) || (today && timesPerDay>1)){if(displayNum>0){evt.currentTarget.setAttribute('data-changed','true');toggleDay(displayDateString,timesPerDay, marked)}}}}>
        <div className={adjustedForOtherMonths.differentMonth?'Different-month':''}>
          <div className='Calendar-day-number'>{displayNum > 0 ? displayNum : ''}</div>
          { (timesPerDay === 1 || today || marked >= 1) && (
            <div className='TimesTaken'>
              {Array.from({ length: timesPerDay }).map((_, index) => {
                return <div className={marked>0 && marked > index ?'Taken imageRotateHorizontal':'NotTaken'} id={`${displayDateString}_${index}`} key={`${displayDateString}_${index}`}>{timesPerDay>1?index + 1:''}</div>;
              })}
            </div>
          )}
          {/* {marked > 0 && timesPerDay === marked && timesPerDay === 1 ? <div className='Calendar-day-marked' style={{ 'transform': `rotate(${displayNum/2}deg)` }}>❌</div> : null} */}
        </div>
      </button>
    </td>
  }

  const writeWeek = (firstDayOfTheMonth: Date, week: number, monthMarkedDates: Array<Dates>) => {
    return <tr key={`week_${week}`} className='Calendar-week'>
      {dateResources.days.long.map((day, dayOfWeek) => {
        return writeDay(firstDayOfTheMonth, day, dayOfWeek + (week * 7), dayOfWeek, monthMarkedDates);
      })}
    </tr>
  }

  const writeMonth = (firstDayOfTheMonth: Date, monthMarkedDates: Array<Dates>) => {
    let month = [];
    for (let week = 0; week < 5; week++) {
      month.push(writeWeek(firstDayOfTheMonth, week, monthMarkedDates));
    }
    return month;
  }
  const displayYear = parseInt(displayDate.split('-')[0]);
  const displayMonth = parseInt(displayDate.split('-')[1]);
  const firstDayOfTheMonth = new Date(displayYear, displayMonth, 1);
  // <KeyNavigation>
  return <table className='Calendar-month'>
      {showDate?<thead>
        <tr>
          <th colSpan={7} className='Calendar-month-title'>{dateResources.months['long'][displayMonth]} <small>{displayYear}</small></th>
        </tr>
      </thead>:null}
      <tbody>
        {writeDayHeaders()}

          {writeMonth(firstDayOfTheMonth, datesData || [])}
        
      </tbody>
    </table>
};

export default Calendar;