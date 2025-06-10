
import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid, Button } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Spinner from "../../component/common/Spinner";


const SuperChecker = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
 

  
//   const columns = [
//     {
//       name: "id",
//       label: "Id",
//       options: {
//         display: false,
//         filter: false,
//         sort: false,
//         align: "center",
//       },
//     },
//     {
//       name: "email",
//       label: "Email",
//       options: {
//         filter: false,
//         sort: false,
//         align: "center",
//       },
//     },
//     {
//       name: "first_name",
//       label: "First Name",
//       options: {
//         filter: false,
//         sort: false,
//         align: "center",
//       },
//     },

//     {
//       name: "last_name",
//       label: "Last Name",
//       options: {
//         filter: false,
//         sort: false,
//         align: "center",
//         setCellProps: () => ({ style: { paddingLeft: "30px" } }),
//       },
//     },
//     {
//       name: "languages",
//       label: "Languages",
//       options: {
//         filter: false,
//         sort: false,
//         align: "center",
//         setCellProps: () => ({ style: { paddingLeft: "30px" } }),
//       },
//     },
//     {
//       name: "participation_type",
//       label: "Participation Type",
//       options: {
//         filter: false,
//         sort: false,
//         align: "center",
//         setCellProps: () => ({ style: { paddingLeft: "70px" } }),
//       },
//     },
//     {
//       name: "role",
//       label: "Role",
//       options: {
//         filter: false,
//         sort: false,
//         align: "center",
//       },
//     },
//     {
//       name: "Actions",
//       label: "Actions",
//       options: {
//         filter: false,
//         sort: false,
//         align: "center",
//         setCellProps: () => ({ style: { paddingLeft: "30px" } }),
//       },
//     },
//   ];

//   const data =
//     UserDetail && UserDetail.length > 0
//       ? pageSearch().map((el, i) => {
//           const userRoleFromList =
//             el.role && UserMappedByRole(el.role)?.element;

//           return [
//             el.id,
//             el.email,
          
           
//           ];
//         })
//       : [];

    
 

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
  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <div>
      {renderSnackBar()}
      {loading && <Spinner />}
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title=""
        //   data={data}
        //   columns={columns}
          options={options}
        />
      </ThemeProvider>

     
    </div>
  );
};

export default SuperChecker;

