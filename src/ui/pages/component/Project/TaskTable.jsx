// TaskTable

import * as React from 'react';
import MUIDataTable from "mui-datatables";
import CustomButton from '../common/Button';

const columns = [
    {
        name: "Context",
        label: "Context",
        options: {
            filter: false,
            sort: false,
            align : "center"
        }
    },
    {
        name: "Input Text",
        label: "Input Text",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Input Language",
        label: "Input Language",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Output Language",
        label: "Output Language",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Machine translation",
        label: "Machine translation",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Key",
        label: "Key",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Status",
        label: "Status",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Actions",
        label: "Actions",
        options: {
            filter: false,
            sort: false,
        }
    }];
const data = [
    ["Task 1", "Display", "English", "Hindi", "प्रदर्शन", "1", "skipped", <CustomButton sx={{ p: 1, borderRadius: 2 }} label={"Edit"} />]
];

const options = {
    filterType: 'checkbox',
    selectableRows: "none"
};

const TaskTable = () => {
    return (
        <React.Fragment>
            <CustomButton sx={{ p: 1, width: '100%', borderRadius: 2, mb: 3 }} label={"Disabled"} />
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

export default TaskTable;