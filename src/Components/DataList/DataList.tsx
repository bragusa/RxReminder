import React, { useEffect, useState } from 'react';
import './DataList.scss';
import { Column } from '../../Interfaces.js';
import Wait from '../Wait/Wait.js';
import { getColumnLength } from '../../Interfaces.js';
import { computeHeadingLevel } from '@testing-library/react';

export interface DataListProps {
  tableName: string;
  data: Array<any>;
  columns: Array<Column>;
  insertRow?: (row: any) => void;
  deleteRow?: (row: any) => void;
  updateValue?: (attrirbute: string, row: number, value: any) => void;
}

const DataList: React.FC<DataListProps> = ({ data, columns, insertRow, deleteRow, updateValue }) => {

  const [noDataMessage, setNoDataMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [listData, setListData] = useState<Array<any>>(data);
  
  useEffect(()=>{
    if(data.length===0){
      setNoDataMessage('No data to display.');
    }
    else {
      setLoading(false);
    }
    data.forEach((row: any, index: number)=>{
      row.editing = false
    });
    setListData(data);
  }, [data]);

  const editing = listData.findIndex((row: any)=>row.editing);
  return <table className='DataList'>
      <thead>
        <tr>
          {columns.map((column: Column, index: number) => {
            return <th className='DataList-header' key={index}>{column.attribute}</th>
          })}
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {listData.map((row: any, rowIndex: number) => {
          return (
            <>
            <tr key={row['name']}>
              {columns.map((column: any, colIndex: number) => {
                const attribute = columns[colIndex].attribute;
                // @ts-ignore
                const maxLength = getColumnLength('medications',attribute);
                const value = row[columns[colIndex].attribute];
                return <td key={`${attribute}`}>
                  {row.editing ?
                  <input maxLength={maxLength} onChange={(evt)=>{
                    const input = evt.currentTarget;
                    const value = evt.currentTarget.value;
                    if(updateValue){
                      //updateValue(columns[colIndex].attribute, rowIndex, value);
                      //listData[rowIndex][attribute] = value;
                    }
                    if(evt.currentTarget.getAttribute('data-change')==='true'){
                      evt.currentTarget.removeAttribute('data-change');
                    }
                  }} type='text' defaultValue={value} data-attribute={attribute}/>:
                  <input readOnly={true} maxLength={maxLength} type='text' value={value}/>}
                  </td>
              })}
              <td>
                {editing===-1?
                <button onClick={()=>{
                  if(updateValue){
                      setListData(()=>{
                        const newData = [...listData];
                        newData[rowIndex].editing = !newData[rowIndex].editing;
                        console.dir(newData);
                        return newData;
                      })
                  }
                }}>✏️</button>:null}
                {editing===rowIndex?
                <button onClick={(evt)=>{
                  if(updateValue){
                    //should save
                    let inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('#xx');
                    if(evt && evt.currentTarget){
                      const tr = evt.currentTarget.closest('TR');
                      if(tr){
                        inputs = tr.querySelectorAll('input[type=text]');
                      }
                    }

                      //listData[rowIndex][attribute] = value;
                    // setListData(()=>{
                    //   const newData = [...listData];
                      inputs.forEach((input)=>{
                        let attribute = input.getAttribute('data-attribute') || 'xxx';
                        if(attribute!=='xxx'){
                          updateValue(attribute,  rowIndex, input.value);
                          listData[rowIndex][attribute] = input.value;
                        }
                        //listData[rowIndex][attribute] = value;
                        // debugger;
                        // if(newData[rowIndex][attribute]){
                        //   newData[rowIndex][attribute] = input.value;
                        // }
                      });
                      // newData[rowIndex].editing = !newData[rowIndex].editing;
                      // console.log(newData);
                      // return newData;
                    //})
                  }
                }}>💾</button>:null}
              </td>
              <td>
                <button onClick={()=>{
                  if(deleteRow){
                    deleteRow(row);
                  }
                }}>🗑️</button>
              </td>
            </tr>
            </>
          )
        })}
      </tbody>
    </table>;

}

export default DataList;