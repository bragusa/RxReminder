import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import DateUtility from './Utility/DateUtility.js';
import Calendar from './Components/Calendar/Calendar.js';
import DBAdapter from './DatabaseAdapter.js';
import Wait from './Components/Wait/Wait.js';
import Dialog from './Components/Dialog/Dialog.js';
import { DialogProps, SimpleDialogProps } from './Components/Dialog/Dialog.js';

import './App.scss';
import EditMedications from './Dialogs/EditMedications/EditMedications.js';

export interface User {
  username: string;
  name: string;
  password: string;
}

export interface Medication {
  username: string;
  name: string;
  sort: number;
}

const dateResources = DateUtility.getResources();

function App() {
  const dbAdapter = new DBAdapter();
  const query = new URLSearchParams(window.location.search);
  const [userName] = useState(query.get('user') || 'guest');
  const [password] = useState(query.get('password') || 'guestpassword');
  const [working, setWorking] = useState(true);

  const [medicationData, setMedicationData] = useState<Array<Medication>>();

  const [userData, setUserData] = useState<User>();
  const [dialogs, setDialogs] = useState<Array<DialogProps>>([]);


  const today = new Date();

  const [displayYear, setDisplayYear] = useState(
    today.getFullYear()
  );

  const [displayMonth, setDisplayMonth] = useState(
    today.getMonth()
  );
  
  const [category, setCategory] = useState('');

  useEffect(()=>{
    if(displayMonth<0){
      setDisplayYear(displayYear-1);
      setDisplayMonth(11);
    }
    if(displayMonth>11){
      setDisplayYear(displayYear+1);
      setDisplayMonth(0);
    }
  }, [displayMonth])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!userName || !password){
          return;
        }
        const userData: Array<User> = await dbAdapter.fetchData(userName, password, 'users', '');
        setUserData(userData[0]);
  
        const medicationData: Array<Medication> = await dbAdapter.fetchData(userName, password, 'medications', 'sort asc');
        if(category===''){
          setCategory(medicationData[0].name);
        }
        setMedicationData(medicationData);
        setWorking(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, [userName]);


  const firstEditableDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
  const medicationIndex = medicationData? medicationData.findIndex((medication) => medication.name===category): 0;


  const medication = medicationData? medicationData[medicationIndex] : {} as Medication;
  const user = userData? {...userData} : {} as User;

  document.title = `RxReminder: ${user.name} - ${medication?.name}`; 

  const closeDialog = ()=>{
    const tempDialogs = [...dialogs];
    tempDialogs.pop();
    setDialogs(tempDialogs);
  };

  const openDialog = (dialog: SimpleDialogProps) => {
    setDialogs([...dialogs, ...[{...dialog, close: closeDialog, user: user, index: dialogs.length}]]);
  };

  const medicationName = medicationData? medicationData[medicationIndex].name : '';
  return (
    <>
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            {user?.name}
            {user?.name?<div>
              <select className='App-medication' value={medicationName} onChange={evt=>{
                  setCategory(evt.currentTarget.value);
                }}>
                { medicationData?.map((medication: Medication, index: number) => {
                  return <option key={index} value={medication.name}>{medication.name}</option>
                }) }
              </select>
              <button className='App-edit' onClick={()=>{
                openDialog({
                  title: 'Edit Medication',
                  content: <EditMedications user={user} close={closeDialog}/>
                });
              }}>✏️</button>
            </div>:!working?'No user found. A username must be supplied.':''}
          </div>
        </div>
        {user?.name?<div>
          <button onClick={()=>{
            setDisplayMonth(displayMonth-1)}} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z" fill="#000000"/>
            </svg>
          </button>
          <button className='App-Today' onClick={evt=>{let today = new Date(); setDisplayMonth(today.getMonth()); setDisplayYear(today.getFullYear());}}>📅</button>
          <span className='App-DateTitle'>{dateResources.months['long'][displayMonth]} {displayYear}</span>
          <button onClick={()=>{setDisplayMonth(displayMonth+1)}} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{transform: 'rotate(180deg)'}}>
              <path fillRule="evenodd" clipRule="evenodd" d="M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z" fill="#000000"/>
            </svg>  
          </button>
        </div>:null}
      </header>
      <div className='App-body'>
        {user.name && medication?.name?<Calendar setWorking={setWorking} user={user} medication={category} showDate={false} displayMonth={displayMonth} displayYear={displayYear} category={category}/>:<div style={{height: '730px'}} ></div>}
        </div>
    </div>
    <div>{dialogs.map((dialog, index)=>
      <Dialog user={user} key={index} index={index} title={dialog.title} content={dialog.content} close={closeDialog}/>
    )}</div>
    <Wait spinner={true} active={working}/>
    </>
  );
}

export default App;
