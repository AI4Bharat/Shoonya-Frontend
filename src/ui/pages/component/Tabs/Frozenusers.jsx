import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, Grid } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import CustomButton from "../common/Button";
import { useSelector, useDispatch } from "react-redux";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import RemoveFrozenUserAPI from "../../../../redux/actions/api/ProjectDetails/RemoveFrozenUser";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useParams } from "react-router-dom";
import CustomizedSnackbars from '../common/Snackbar';


export default function Frozenusers(props) {
  const { onRemoveFrozenusers,ProjectDetails } = props;

  const dispatch = useDispatch();
  const { id } = useParams();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const handleRemoveFrozenUsers = async(FrozenUserId) => {
    const projectObj = new RemoveFrozenUserAPI(id, { ids: [FrozenUserId] });
    //dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
  });
  const resp = await res.json();
  // setLoading(false);
  if (res.ok) {
      setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
      })
      onRemoveFrozenusers();
  } else {
      setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
      })
  }
  };

  const columns = [
    {
      name: "id",
      label: "",
      options: {
        display: "excluded",
        filter: true,
      },
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },
    {
      name: "Email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },
    {
      name: "Role",
      label: "Role",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },

    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const data =
    ProjectDetails?.frozen_users && ProjectDetails?.frozen_users.length > 0
      ? ProjectDetails?.frozen_users.map((el, i) => {
          const userRole = el.role && UserMappedByRole(el.role).element;
          return [
            el.id,
            el.username,
            el.email,
            userRole ? userRole : el.role,
            <>
              <CustomButton
                sx={{ borderRadius: 2, backgroundColor: "#cf5959" }}
                label="Remove"
                onClick={() => handleRemoveFrozenUsers(el.id)}
              />
            </>,
          ];
        })
      : [];

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
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          // title={""}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>
  );
}
