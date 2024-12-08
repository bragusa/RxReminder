import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import './EditMedications.scss';
import DBAdapter from '../../DatabaseAdapter';
import DataList from '../../Components/DataList/DataList.js';
const EditMedications = forwardRef(({ user, close }, ref) => {
    const updateMedication = async (medication) => {
        if (!user) {
            return;
        }
        // const result = await dbTransactions.updateMedication(user.username, user.password, medication.name, medication.sort);
        // console.log(result);
    };
    useImperativeHandle(ref, () => ({
        apply() {
            console.log('Apply action triggered');
            medications.forEach((medication) => {
                updateMedication(medication);
            });
            close(); //if successful
        },
        cancel() {
            close();
        }
    }));
    const dbAdapter = DBAdapter();
    const [medications, setMedications] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                return;
            }
            const medicationData = await dbAdapter.fetchData('medications', 'sort');
            setMedications(medicationData);
        };
        fetchData();
    }, []);
    return _jsx(_Fragment, { children: _jsx(DataList, { tableName: 'medications', data: medications, columns: [{ attribute: 'name' }, { attribute: 'sort' }], updateValue: (attribute, row, value) => {
                setMedications([...medications.slice(0, row), Object.assign(Object.assign({}, medications[row]), { [attribute]: value }), ...medications.slice(row + 1)]);
            } }) });
});
export default EditMedications;
