import React, { useState} from "react";
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import CustomButton from "../../component/common/Button";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

const DatasetCardList = (props) => {
    const { datasetList } = props

   const columns = [
        {
            name: "Dataset_id",
            label: "Dataset Id",
            options: {
                filter: false,
                sort: false,
                align: "center",
                setCellHeaderProps: sort => ({ style: { height: "70px",  padding: "16px" } }),
            }
        },
        {
            name: "Dataset_Title",
            label: "Dataset Title",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },


        {
            name: "Dataset_Type",
            label: "Dataset Type",
            options: {
                filter: false,
                sort: false,
            }
        },

        {
            name: "Action",
            label: "Action",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },

    ];



    const data = datasetList && datasetList.length > 0 ? datasetList.map((el, i) => {
        return [
            el.instance_id,
            el.instance_name,
            el.dataset_type,
            <Link to={`/datasets/${el.instance_id}`} style={{ textDecoration: "none" }}>
                <CustomButton
                    sx={{ borderRadius: 2, marginRight: 2 }}
                    label="View"
                />
            </Link>
        ]
    }) : [];

    const options = {
        textLabels: {
            body: {
                noMatch: "No records",
            },
            toolbar: {
                search: "Search",
                viewColumns: "View Column",
            },
            pagination: { rowsPerPage: "Rows per page" },
            options: { sortDirection: "desc" },
        },
        // customToolbar: fetchHeaderButton,
        displaySelectToolbar: false,
        fixedHeader: false,
        filterType: "checkbox",
        download: false,
        print: false,
        rowsPerPageOptions: [10, 25, 50, 100],
        // rowsPerPage: PageInfo.count,
        filter: false,
        // page: PageInfo.page,
        viewColumns: false,
        selectableRows: "none",
        search: false,
        jumpToPage: true,
    };

    return (
        <div>
            <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>

        </div>

    )
}

export default DatasetCardList;