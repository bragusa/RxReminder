import React, { useEffect, useState} from 'react';
import DateUtility from '../../Utility/DateUtility';
import './Calendar.scss';
import DBAdapter from '../../DatabaseAdapter.js';
import KeyNavigation from '../KeyNavigation/KeyNavigation.js';

interface User {
  username: string;
  name: string;
  password: string;
}

interface Props  {
  user: User,
  medication: string,
  showDate: boolean,
  displayMonth: number;
  displayYear: number;
  setWorking(working: boolean): void;
}

interface Dates {
  username: string,
  medication: string,
  date: string,
  marked: number
}


const Calendar: React.FC<Props> = ({ displayMonth, displayYear, user, medication, setWorking, showDate = true }) => {

  const dbTransactions = DBAdapter();

  const [datesData, setDatesData] = useState<Array<Dates>>();

  const dateResources = DateUtility.getResources();


  useEffect(() => {
    const fetchData = async () => {
      if (!user.username || !medication || !displayMonth || !displayYear) {
        console.log('Cannot fetch. Missing one of: userName, medication, displayMonth, displayYear');
        return;
      }
  
      try {
        const datesData: Array<Dates> = await dbTransactions.fetchData('dates', 'date asc');
        setDatesData(datesData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  
    fetchData();
  }, [user.username, medication, displayMonth, displayYear]);
  
  const writeDayHeaders = () => {
    return <tr className='Calendar-headers'>
      {dateResources.days['short'].map((day) => {
        return <th key={`key_${day}`}><div>{day}</div></th>;
      })}
    </tr>
  }

  const toggleDay = async(date: string, marked: boolean) => {
    setWorking(true);
    const success = await dbTransactions.markDate(medication, date, marked ? 0 : 1);
  
    const newDatesData: Array<Dates> = await dbTransactions.fetchData('dates', 'date asc');
    // Only update if new data differs
    if (JSON.stringify(newDatesData) !== JSON.stringify(datesData)) {
      setDatesData(newDatesData);
    }
    setWorking(false);    
  }

  const writeDay = (firstDayOfTheMonth: Date, day: string, dayNum: number, dayOfWeek: number, markedDates: Array<Dates>) => {
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
    const todaysString = `${thisDaysDate.getFullYear()}-${(thisDaysDate.getMonth()+1).toString().padStart(2, '0')}-${thisDaysDate.getDate().toString().padStart(2, '0')}`;
    const displayDateString = `${firstDayOfTheMonth.getFullYear()}-${(firstDayOfTheMonth.getMonth()+1).toString().padStart(2, '0')}-${displayNum.toString().padStart(2, '0')}`;

    const currentDateData = markedDates?.filter(date=> {
      const equal = date.date===displayDateString && date.medication === medication;
      return equal
    });
    // next line must be == to compare string and number
    const marked = currentDateData && currentDateData.length>0 ? currentDateData[0].marked == 1 : false;
    const todaysDate = new Date();
    const today = displayNum === todaysDate.getDate() && displayMonth === todaysDate.getMonth() && displayYear === todaysDate.getFullYear();
    return <td className={today?'Calendar-today':''} data-marked={marked} key={`key${dayNum}`}  onDoubleClick={()=>{if(displayNum>0){;toggleDay(displayDateString, marked)}}} >
      <button className='Calendar-day' disabled={!displayNum} onKeyUp={(evt)=>{
        if(['Enter', ' '].includes(evt.key) && displayNum>0){toggleDay(displayDateString, marked);}
      }} onClick={(evt)=>{if((today && !marked) || (today && evt.ctrlKey)){if(displayNum>0){toggleDay(displayDateString, marked)}}}}>
        <div className={displayNum === 0?'Empty':''}>
        {displayNum > 0? <div className='Calendar-day-number'>{displayNum > 0 ? displayNum : ''}</div>: null }
          {marked ? <div className='Calendar-day-marked' style={{ 'transform': `rotate(${displayNum/2}deg)` }}>❌</div> : null}
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