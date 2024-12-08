import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import './DataList.scss';
import { getColumnLength } from '../../Interfaces.js';
const DataList = ({ data, columns, insertRow, deleteRow, updateValue }) => {
    const [noDataMessage, setNoDataMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [listData, setListData] = useState(data);
    useEffect(() => {
        if (data.length === 0) {
            setNoDataMessage('No data to display.');
        }
        else {
            setLoading(false);
        }
        data.forEach((row, index) => {
            row.editing = false;
        });
        setListData(data);
    }, [data]);
    const editing = listData.findIndex((row) => row.editing);
    return _jsxs("table", { className: 'DataList', children: [_jsx("thead", { children: _jsxs("tr", { children: [columns.map((column, index) => {
                            return _jsx("th", { className: 'DataList-header', children: column.attribute }, index);
                        }), _jsx("th", {}), _jsx("th", {})] }) }), _jsx("tbody", { children: listData.map((row, rowIndex) => {
                    return (_jsx(_Fragment, { children: _jsxs("tr", { children: [columns.map((column, colIndex) => {
                                    const attribute = columns[colIndex].attribute;
                                    // @ts-ignore
                                    const maxLength = getColumnLength('medications', attribute);
                                    const value = row[columns[colIndex].attribute];
                                    return _jsx("td", { children: row.editing ?
                                            _jsx("input", { maxLength: maxLength, onChange: (evt) => {
                                                    const input = evt.currentTarget;
                                                    const value = evt.currentTarget.value;
                                                    if (updateValue) {
                                                        //updateValue(columns[colIndex].attribute, rowIndex, value);
                                                        //listData[rowIndex][attribute] = value;
                                                    }
                                                    if (evt.currentTarget.getAttribute('data-change') === 'true') {
                                                        evt.currentTarget.removeAttribute('data-change');
                                                    }
                                                }, type: 'text', defaultValue: value, "data-attribute": attribute }) :
                                            _jsx("input", { readOnly: true, maxLength: maxLength, type: 'text', value: value }) }, `${attribute}`);
                                }), _jsxs("td", { children: [editing === -1 ?
                                            _jsx("button", { onClick: () => {
                                                    if (updateValue) {
                                                        setListData(() => {
                                                            const newData = [...listData];
                                                            newData[rowIndex].editing = !newData[rowIndex].editing;
                                                            console.dir(newData);
                                                            return newData;
                                                        });
                                                    }
                                                }, children: "\u270F\uFE0F" }) : null, editing === rowIndex ?
                                            _jsx("button", { onClick: (evt) => {
                                                    if (updateValue) {
                                                        //should save
                                                        let inputs = document.querySelectorAll('#xx');
                                                        if (evt && evt.currentTarget) {
                                                            const tr = evt.currentTarget.closest('TR');
                                                            if (tr) {
                                                                inputs = tr.querySelectorAll('input[type=text]');
                                                            }
                                                        }
                                                        //listData[rowIndex][attribute] = value;
                                                        // setListData(()=>{
                                                        //   const newData = [...listData];
                                                        inputs.forEach((input) => {
                                                            let attribute = input.getAttribute('data-attribute') || 'xxx';
                                                            if (attribute !== 'xxx') {
                                                                updateValue(attribute, rowIndex, input.value);
                                                                listData[rowIndex][attribute] = input.value;
                                                            }
                                                            //listData[rowIndex][attribute] = value;
                                                            // ;
                                                            // if(newData[rowIndex][attribute]){
                                                            //   newData[rowIndex][attribute] = input.value;
                                                            // }
                                                        });
                                                        // newData[rowIndex].editing = !newData[rowIndex].editing;
                                                        // console.log(newData);
                                                        // return newData;
                                                        //})
                                                    }
                                                }, children: "\uD83D\uDCBE" }) : null] }), _jsx("td", { children: _jsx("button", { onClick: () => {
                                            if (deleteRow) {
                                                deleteRow(row);
                                            }
                                        }, children: "\uD83D\uDDD1\uFE0F" }) })] }, row['name']) }));
                }) })] });
};
export default DataList;
