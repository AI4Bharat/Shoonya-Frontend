// ReportsTable

import * as React from 'react';
import MUIDataTable from "mui-datatables";
import CustomButton from '../common/Button';
import { Typography } from '@mui/material';


const columns = [
    {
        name: "Username",
        label: "Username",
        options: {
            filter: false,
            sort: false,
            align : "center"
        }
    },
    {
        name: "Mail",
        label: "Mail",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Total Annoted Tasks",
        label: "Total Annoted Tasks",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Avg Lead Time",
        label: "Avg Lead Time",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Total Assigned Time",
        label: "Total Assigned Time",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Skipped Time",
        label: "Skipped Time",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Total Pending Time",
        label: "Total Pending Time",
        options: {
            filter: false,
            sort: false,
        }
    }
];
const data = [
    ["Shoonya User", "user123@tarento.com", 0, 5, 4, 7, 8, 9]
];

const options = {
    filterType: 'checkbox',
    selectableRows: "none",
    download : false,
    filter : false,
    print : false
};

const ReportsTable = () => {
    return (
        <React.Fragment>
            <MUIDataTable
                title={""}
                data={data}
                columns={columns}
                options={options}
                // filter={false}
            />
        </React.Fragment>
    )
}

export default ReportsTable;