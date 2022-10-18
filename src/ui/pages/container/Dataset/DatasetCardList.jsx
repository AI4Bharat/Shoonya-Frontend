import React, { useState} from "react";
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import CustomButton from "../../component/common/Button";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import { useDispatch, useSelector } from 'react-redux';

const DatasetCardList = (props) => {
    const { datasetList } = props
    const SearchDataset = useSelector((state) => state.SearchProjectCards.data);

    const pageSearch = () => {

        return datasetList.filter((el) => {

            if (SearchDataset == "") {

                return el;
            } else if (
                el.dataset_type
                    ?.toLowerCase()
                    .includes(SearchDataset?.toLowerCase())
            ) {

                return el;
            } else if (
                el.instance_name
                    ?.toLowerCase()
                    .includes(SearchDataset?.toLowerCase())
            ) {



                return el;
            }  
             else if (
                el.instance_id.toString()?.toLowerCase()
                    ?.includes(SearchDataset.toLowerCase())
            ) {

                return el;
            }


        })

    }

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



    const data = datasetList && datasetList.length > 0 ? pageSearch().map((el, i) => {
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