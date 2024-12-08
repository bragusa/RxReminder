import React, { forwardRef, useImperativeHandle, useEffect, useState, ReactElement } from 'react';
import logo from './logo.svg';
import './EditMedications.scss';
import DBAdapter from '../../DatabaseAdapter';
import { DialogContentProps, DialogContentRef } from '../../Components/Dialog/Dialog.js';
import { Medication, User } from '../../App.js';
import DataList from '../../Components/DataList/DataList.js';

const EditMedications = forwardRef<DialogContentRef, DialogContentProps>(({ user, close }, ref) => {

  const updateMedication = async (medication: Medication) => {
    if(!user){
      return;
    }
    // const result = await dbTransactions.updateMedication(user.username, user.password, medication.name, medication.sort);
    // console.log(result);
  }

  useImperativeHandle(ref, () => ({
    apply() {
      console.log('Apply action triggered');

      medications.forEach((medication: Medication) => {
        updateMedication(medication);
      });

      close(); //if successful
    },
    cancel() {
      close();
    }
  }));

  const dbAdapter = DBAdapter();

  const [medications, setMedications] = useState([] as Array<Medication>);

  useEffect(()=>{

    const fetchData = async () => {
        if(!user){
          return;
        }
        const medicationData: Array<Medication> = await dbAdapter.fetchData('medications', 'sort');
        setMedications(medicationData);    
      }
    fetchData();
  }, [])

  return <>
    <DataList tableName={'medications'} data={medications} columns={[{attribute: 'name'}, {attribute:'sort'}]} updateValue={(attribute: string, row: number, value: any)=>{
      setMedications([...medications.slice(0, row), {...medications[row], [attribute]: value}, ...medications.slice(row+1)]);
    }} />
  </>;
});

export default EditMedications;