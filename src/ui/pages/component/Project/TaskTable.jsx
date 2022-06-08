// TaskTable

import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GetTasksByProjectIdAPI from "../../../../redux/actions/api/Tasks/GetTasksByProjectId";
import CustomButton from '../common/Button';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";

const columns = [
    {
        name: "ID",
        label: "ID",
        options: {
            filter: false,
            sort: false,
            align: "center"
        }
    },
    {
        name: "Context",
        label: "Context",
        options: {
            filter: false,
            sort: false,
            align: "center"
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





const TaskTable = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const taskList = useSelector(state => state.getTasksByProjectId.data.results);
    

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [totalTasks, setTotalTasks] = useState(10);

    const getTaskListData = () => {
        const taskObj = new GetTasksByProjectIdAPI(id, currentPageNumber, currentRowPerPage);
        dispatch(APITransport(taskObj));
    }
    
    const totalTaskCount = useSelector(state => state.getTasksByProjectId.data.count);
    

    useEffect(() => {
        getTaskListData();
        setTotalTasks(totalTaskCount);
    },[]);

    // useEffect(() => {
    //     const taskObj = new GetTasksByProjectIdAPI(id, currentPageNumber, totalTaskCount);
    //     dispatch(APITransport(taskObj));
    // },[totalTaskCount]);

    useEffect(() => {
        getTaskListData();
        console.log("fired now")
    }, [currentPageNumber]);

    useEffect(() => {
        getTaskListData();
        console.log("fired now")
    }, [currentRowPerPage]);

    const options = {
        count : currentRowPerPage,
        rowsPerPage : currentRowPerPage,
        page : Math.ceil(totalTaskCount%currentRowPerPage),
        rowsPerPageOptions: [10, 25, 50, 100],
        textLabels:{
            pagination: {
              next: "Next >",
              previous: "< Previous",
              rowsPerPage: "currentRowPerPage",
              displayRows: "OF"
            }
          },
        onChangePage:(currentPage)=>{setCurrentPageNumber(currentPage)},
        onChangeRowsPerPage:(rowPerPageCount)=>{setCurrentRowPerPage(rowPerPageCount); console.log("rowPerPageCount", rowPerPageCount)},
        filterType: 'checkbox',
        selectableRows: "none",
        download : false,
        filter : false,
        print : false
    };

    const data = taskList && taskList.length > 0 ? taskList.map((el,i)=>{
        return [
                el.id, 
                el.data.context, 
                el.data.input_text, 
                el.data.input_language, 
                el.data.output_language, 
                el.data.machine_translation, 
                el.task_status, 
                <CustomButton onClick={()=>console.log("task id === ", el.id)} sx={{ p: 1, borderRadius: 2 }} label={<Typography sx={{inlineSize : "max-content",}} variant="caption">Annotate This Task</Typography>} /> ]
    }) : []

    // console.log("taskList", taskList);

    return (
        <Fragment>
            <CustomButton sx={{ p: 1, width: '100%', borderRadius: 2, mb: 3 }} label={"Disabled"} />
            <MUIDataTable
                title={""}
                data={data}
                columns={columns}
                options={options}
            // filter={false}
            />
        </Fragment>
    )
}

export default TaskTable;