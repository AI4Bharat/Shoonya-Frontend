import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Link, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import GetWorkspacesManagersDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceManagers";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../common/Button";
import { ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import tableTheme from "../../../theme/tableTheme";
import RemoveWorkspaceManagerAPI from "../../../../redux/actions/api/WorkspaceDetails/RemoveWorkspaceManager";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import TextField from "@mui/material/TextField";
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";

const ManagersTable = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const { id } = useParams();
  // const orgId = useSelector(state=>state.getWorkspacesProjectData?.data?.[0]?.organization_id);
  const getWorkspaceManagersData = () => {
    const workspaceObjs = new GetWorkspacesManagersDataAPI(id);

    dispatch(APITransport(workspaceObjs));
  };
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);

    // Force responsive mode after component mount
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector('.MuiDataTable-responsiveBase');
        if (tableWrapper) {
          tableWrapper.classList.add('MuiDataTable-vertical');
        }
      }
    };

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getWorkspaceManagersData();
  }, []);

  const workspaceManagers = useSelector(
    (state) => state.getWorkspacesManagersData.data
  );
  const SearchWorkspaceManagers = useSelector(
    (state) => state.SearchProjectCards.data
  );

  const handleRemoveWorkspaceManager = async (userid) => {
    const projectObj = new RemoveWorkspaceManagerAPI(id, { ids: [userid] });
    // dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: "Successfully Removed",
        variant: "success",
      });
      getWorkspaceManagersData();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };
  const pageSearch = () => {
    return workspaceManagers.filter((el) => {
      if (SearchWorkspaceManagers == "") {
        return el;
      } else if (
        el.username
          ?.toLowerCase()
          .includes(SearchWorkspaceManagers?.toLowerCase())
      ) {
        return el;
      } else if (
        el.email?.toLowerCase().includes(SearchWorkspaceManagers?.toLowerCase())
      ) {
        return el;
      }
    });
  };
  const columns = [
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" },
        }),
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
      setCellProps: () => ({
        style: {
          fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        },
      }),
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
    workspaceManagers && workspaceManagers.length > 0
      ? pageSearch().map((el, i) => {
          return [
            el.username,
            el.email,
            <>
              <Link to={`/profile/${el.id}`} style={{ textDecoration: "none" }}>
                <CustomButton sx={{ borderRadius: 2, m: 1 }} label="View" />
              </Link>
              <CustomButton
                sx={{ borderRadius: 2, backgroundColor: "#cf5959" }}
                label="Remove"
                onClick={() => {
                  setElId(el.id);
                  setElEmail(el.email);
                  setConfirmationDialog(true);
                }}
              />
            </>,
          ];
        })
      : [];
  const CustomFooter = ({
    count,
    page,
    rowsPerPage,
    changeRowsPerPage,
    changePage,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px",
          },
        }}
      >
        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => changePage(newPage)}
          onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
          sx={{
            "& .MuiTablePagination-actions": {
              marginLeft: "0px",
            },
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input":
              {
                marginRight: "10px",
              },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label
            style={{
              marginRight: "5px",
              fontSize: "0.83rem",
            }}
          >
            Jump to Page:
          </label>
          <Select
            value={page + 1}
            onChange={(e) => changePage(Number(e.target.value) - 1)}
            sx={{
              fontSize: "0.8rem",
              padding: "4px",
              height: "32px",
            }}
          >
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Box>
    );
  };

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
    responsive: "vertical",
    enableNestedDataAccess: ".",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
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

  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [elEmail, setElEmail] = useState("");
  const [elId, setElId] = useState("");
  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      handleRemoveWorkspaceManager(elId);
      setConfirmationDialog(false);
    } else {
      window.alert("Invalid credentials, please try again");
      console.log(rsp_data);
    }
  };

  return (
    <div>
      {renderSnackBar()}
      <Dialog
        open={confirmationDialog}
        onClose={() => setConfirmationDialog(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">
          {"Remove Member from Project?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {elEmail} will be removed from this workspace. Please be careful as
            this action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmationDialog(false)}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
      <div ref={tableRef}>
          {isBrowser ? (
            <MUIDataTable
              key={`table-${displayWidth}`}
              title={""}
              data={data}
              columns={columns}
              options={options}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{
                mx: 2,
                my: 3,
                borderRadius: '4px',
                transform: 'none'
              }}
            />
          )}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default ManagersTable;
