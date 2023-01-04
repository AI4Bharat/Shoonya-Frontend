import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Themes
import {
  Box,
  Grid,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
  IconButton,
  DialogContentText,
  Button,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import MUIDataTable from "mui-datatables";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GlossarysentenceAPI from "../../../../redux/actions/api/ProjectDetails/GlossarySentence";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomizedSnackbars from "../../component/common/Snackbar";

export default function Glossary(props) {
  const { taskData } = props;
  const dispatch = useDispatch();
  const Glossarysentence = useSelector((state) => state.glossarysentence.data);
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false
  });

  useEffect(() => {
    if (taskData && taskData.data) {
      const Glossarysentencedata = {
        inputs: [taskData.data?.input_text],
        tgtLanguage: "as",
      };
      const GlossaryObj = new GlossarysentenceAPI(Glossarysentencedata);
      dispatch(APITransport(GlossaryObj));
    }
  }, [taskData]);



  const handleCopyText = (text)=>{
    navigator.clipboard.writeText(text);
    setShowSnackBar({
        message: "Copied to clipboard!",
        variant: "success",
        timeout: 1500,
        visible: true
      })
  }
  const handleSnackBarClose = () => {
    setShowSnackBar({
      message: "",
      variant: "",
      timeout: 1500,
      visible: false
    })
  }

  const columns = [
    {
      name: "srcText",
      label: "Source",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
      name: "tgtText",
      label: "Target ",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
        name: "domain",
        label: "Domain",
        options: {
          filter: false,
          sort: false,
          align: "center",
          setCellHeaderProps: () => ({
            style: {
              height: "30px",
              fontSize: "16px",
              padding: "16px",
              textAlign: "center",
            },
          }),
          setCellProps: () => ({ style: { textAlign: "center" } }),
        },
      },
      {
        name: "collectionSource",
        label: "Collection Source",
        options: {
          filter: false,
          sort: false,
          align: "center",
          setCellHeaderProps: () => ({
            style: {
              height: "30px",
              fontSize: "16px",
              padding: "16px",
              textAlign: "center",
            },
          }),
          setCellProps: () => ({ style: { textAlign: "center" } }),
        },
      },
      
      {
        name: "Action",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          align: "center",
          setCellHeaderProps: () => ({
            style: {
              height: "30px",
              fontSize: "16px",
              padding: "16px",
              textAlign: "center",
            },
          }),
          setCellProps: () => ({ style: { textAlign: "center" } }),
        },
      },
  ];

  const data =  Glossarysentence[0]?.glossaryPhrases && Glossarysentence[0]?.glossaryPhrases.length > 0 ? Glossarysentence[0]?.glossaryPhrases.map((el,i)=>{
    return [
                el.srcText, 
                el.tgtText,
                el.domain, 
                el.collectionSource,
                <>
                    <Button
                     onClick={()=>handleCopyText(el.tgtText)} 
                    ><ContentCopyIcon  fontSize="small"/></Button>
                    
                </>
            ]
}) :[];

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
    <> <CustomizedSnackbars
    hide={showSnackBar.timeout}
    open={showSnackBar.visible}
    handleClose={handleSnackBarClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    variant={showSnackBar.variant}
    message={showSnackBar.message}
  />
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable
        data={data}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
    </>
  );
}
