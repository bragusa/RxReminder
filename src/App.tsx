import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import DateUtility from './Utility/DateUtility.js';
import Calendar from './Components/Calendar/Calendar.js';
import DBAdapter from './DatabaseAdapter.js';
import Wait from './Components/Wait/Wait.js';
import Dialog from './Components/Dialog/Dialog.js';
import { useNavigate } from 'react-router-dom';
import { DialogProps, SimpleDialogProps } from './Components/Dialog/Dialog.js';
import { useAuth } from "./AuthContext";
import signout from './Resources/images/signout.png';

import './App.scss';
import EditMedications from './Dialogs/EditMedications/EditMedications.js';

export interface User {
  username: string;
  name: string;
}

export interface Medication {
  timesperday: any;
  username: string;
  name: string;
  sort: number;
}

const dateResources = DateUtility.getResources();

function App() {

  const dbAdapter = DBAdapter();
  const [working, setWorking] = useState(true);
  const [medicationData, setMedicationData] = useState<Array<Medication>>();

  const [userData, setUserData] = useState<User>();
  const [dialogs, setDialogs] = useState<Array<DialogProps>>([]);

  const [displayDate, setDisplayDate] = useState<string>(`${new Date().getFullYear()}-${new Date().getMonth()}`);

  const changeDisplayMonth = (month: number) => {
    const displayDateArray = displayDate?.split('-');
    if(month >=12 ){
      setDisplayDate(`${parseInt(displayDateArray[0])+1}-0`)
    } else if(month < 0){
      setDisplayDate(`${parseInt(displayDateArray[0])-1}-11`)
    } else {
      setDisplayDate(`${parseInt(displayDateArray[0])}-${month}`)
    }
  }

  const [category, setCategory] = useState('');
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    //subtract 60000 - 1 minute
    const checkforTimeout = async () =>{
      const timeout = sessionStorage.getItem('session_timeout');

      if(timeout){
        const now = new Date().getTime();
        if(now>parseInt(timeout)-60000){ //within 1 minute of logout
          sessionStorage.removeItem('session_timeout');
          // eslint-disable-next-line react-hooks/exhaustive-deps
          const logout = await dbAdapter.logout();
          if(logout.status==='success'){
            window.location.reload();
            return;
          }
          setWorking(false);  
        }
      }
      setTimeout(checkforTimeout, 30000); // 5 minutes
    }


    const fetchData = async () => {
      try {
        checkforTimeout();
        
        const userData: Array<User> = await dbAdapter.fetchData('users', '');
        setUserData(userData[0]);
  
        const medicationData: Array<Medication> = await dbAdapter.fetchData('medications', 'sort asc');
        setCategory(medicationData[0].name);
        setMedicationData(medicationData);
        setWorking(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const medicationIndex = medicationData? medicationData.findIndex((medication) => medication.name===category): 0;

  const medication = medicationData? medicationData[medicationIndex] : {} as Medication;
  const user = userData? {...userData} : {} as User;

  document.title = `RxReminder: ${user.name} - ${medication?.name}`; 

  const closeDialog = ()=>{
    const tempDialogs = [...dialogs];
    tempDialogs.pop();
    setDialogs(tempDialogs);
  };

  // const openDialog = (dialog: SimpleDialogProps) => {
  //   setDialogs([...dialogs, ...[{...dialog, close: closeDialog, user: user, index: dialogs.length}]]);
  // };

  const medicationName = medicationData? medicationData[medicationIndex].name : '';
  const timesPerDay = medicationData? parseInt(String(medicationData[medicationIndex].timesperday)) : 1;

  const displayMonth = parseInt(displayDate.split('-')[1]);
  return (
    <>
      <div className="App">
        
        <header className="App-header">
        <div className='Title'>
            <img src="/rxreminder/favicon.png" style={{width: '2rem'}}/><div>RxReminder</div>
        </div>
        <div style={{justifyContent: 'flex-end'}}>
          <button className='SignOut' onClick={async ()=>{
            setWorking(true);
            setTimeout( async ()=>{
              const logout = await dbAdapter.logout();
              if(logout.status==='success'){
                window.location.reload();
                return;
              }
              setWorking(false);  
            }, 100);
            
          }} ><img src={signout}/></button>
        </div>
          <div>
            <div>
              <h4>{user?.name}</h4>
              <div style={{fontSize: '3rem'}}>
                <select id='category' className='App-medication' value={medicationName} onChange={evt=>{
                    setCategory(evt.currentTarget.value);
                  }}>
                  { medicationData?.map((medication: Medication, index: number) => {
                    return <option key={index} value={medication.name}>{medication.name}</option>
                  }) }
                </select><div style={{fontSize: '1rem'}}>{`( ${timesPerDay} per day )`}</div>
                {/* <button className='App-edit' onClick={()=>{
                  openDialog({
                    title: 'Edit Medication',
                    content: <EditMedications user={user} close={closeDialog}/>,
                    apply: 'Save',
                    cancel: 'Cancel'
                  });
                }}>✏️</button> */}
              </div>
            </div>
          </div>
          {user?.name?<div>
            <button onClick={()=>{
              changeDisplayMonth(displayMonth-1)}} >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z" fill="#000000"/>
              </svg>
            </button>
            <button className='App-Today' onClick={evt=>{let today = new Date(); setDisplayDate(`${today.getFullYear()}-${today.getMonth()}`)}}>
              <div className='Today-icon'>
                <div>{dateResources.months['short'][new Date().getMonth()]}</div>
                <div>
                  {new Date().getDate()}
                </div>
              </div>
            </button>
            <span className='App-DateTitle'>{dateResources.months['long'][parseInt(displayDate.split('-')[1])]} {displayDate.split('-')[0]}</span>
            <button onClick={()=>{changeDisplayMonth(displayMonth+1)}} >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{transform: 'rotate(180deg)'}}>
                <path fillRule="evenodd" clipRule="evenodd" d="M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z" fill="#000000"/>
              </svg>  
            </button>
          </div>:null}
        </header>
        <div className='App-body'>
          {user.name && medication?.name?<Calendar setWorking={setWorking} user={user} medication={category} timesPerDay={timesPerDay} showDate={false} displayDate={displayDate}/*displayMonth={displayMonth} displayYear={displayYear}*/ />:<div style={{height: '730px'}} ></div>}
          </div>
      </div>

      <div>{dialogs.map((dialog, index)=>{
        return <Dialog cancel={null} apply={dialog.apply} user={user} key={dialog.title} index={index} title={dialog.title} content={dialog.content} close={closeDialog}/>
      })}</div>
      <Wait spinner={true} active={working} />
    </>
  );
}

export default App;
