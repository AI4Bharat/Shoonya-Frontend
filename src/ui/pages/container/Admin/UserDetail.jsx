import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../../theme/tableTheme";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import GetUserDetailAPI from "../../../../redux/actions/api/Admin/UserDetail";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UserInfo from "./UserInfo";
import Spinner from "../../component/common/Spinner";
import GetUserDetailUpdateAPI from "../../../../redux/actions/api/Admin/EditProfile";

const UserDetail = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [language, setLanguage] = useState([]);
  const [participationType, setParticipationType] = useState("");
  const [Role, setRole] = useState("");

  const UserDetail = useSelector((state) => state.getUserDetails.data);
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const SearchUserDetail = useSelector(
    (state) => state.SearchProjectCards.data
  );
  const getUserDetail = () => {
    setLoading(true);
    const UserObj = new GetUserDetailAPI();
    dispatch(APITransport(UserObj));
  };
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);

    // Force responsive mode after component mount
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector(
          ".MuiDataTable-responsiveBase"
        );
        if (tableWrapper) {
          tableWrapper.classList.add("MuiDataTable-vertical");
        }
      }
    };

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    if (UserDetail.length > 0) {
      setLoading(false);
    }
  }, [UserDetail]);

  const handleEditChange = (
    id,
    email,
    username,
    first_name,
    last_name,
    languages,
    participation_type,
    role,
    is_active
  ) => {
    setOpenDialog(true);
    setId(id);
    setEmail(email);
    setUserName(username);
    setFirstName(first_name);
    setLastName(last_name);
    setLanguage(languages);
    setParticipationType(participation_type);
    setRole(role);
    setActive(is_active);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateEditProfile = async () => {
    const data = {
      email: email,
      username: userName,
      first_name: firstName,
      last_name: lastName,
      languages: language,
      participation_type: participationType,
      role: Role,
      is_active: active,
    };

    const UserObj = new GetUserDetailUpdateAPI(id, data);
    //  dispatch(APITransport(UserObj));
    const res = await fetch(UserObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(UserObj.getBody()),
      headers: UserObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      getUserDetail();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    handleCloseDialog();
  };

  const pageSearch = () => {
    return UserDetail.filter((el) => {
      if (SearchUserDetail == "") {
        return el;
      } else if (
        el.email?.toLowerCase().includes(SearchUserDetail?.toLowerCase())
      ) {
        return el;
      } else if (
        el.username?.toLowerCase().includes(SearchUserDetail?.toLowerCase())
      ) {
        return el;
      } else if (
        el.first_name?.toLowerCase().includes(SearchUserDetail?.toLowerCase())
      ) {
        return el;
      } else if (
        el.is_active
          ?.toString()
          ?.toLowerCase()
          .includes(SearchUserDetail?.toLowerCase())
      ) {
        return el;
      } else if (
        el.last_name?.toLowerCase().includes(SearchUserDetail?.toLowerCase())
      ) {
        return el;
      } else if (
        el.participation_type
          .toString()
          ?.toLowerCase()
          .includes(SearchUserDetail?.toLowerCase())
      ) {
        return el;
      } else if (
        el.languages?.some((val) =>
          val?.toLowerCase().includes(SearchUserDetail?.toLowerCase())
        )
      ) {
        return el;
      }
    });
  };

  const columns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: false,
        filter: false,
        sort: false,
        align: "center",
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
      setCellProps: () => ({ 
         style: {
          padding: "16px",
          minWidth: "170px",
          whiteSpace: "normal",
          overflowWrap: "break-word",
          wordBreak: "break-word", 
        }
        }),
    },
    {
      name: "username",
      label: "UserName",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
      setCellProps: () => ({ 
          style: {
          padding: "16px",
          minWidth: "170px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
    },
    {
      name: "first_name",
      label: "First Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
      setCellProps: () => ({ style: { padding: "16px" } }),
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "languages",
      label: "Languages",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "participation_type",
      label: "Participation Type",
      options: {
        filter: false,
        sort: false,
          align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "role",
      label: "Role",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "is_active",
      label: "Active Status",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { padding: "16px" } }),
      },
    },
  ];

  const data =
    UserDetail && UserDetail.length > 0
      ? pageSearch().map((el, i) => {
          const userRoleFromList =
            el.role && UserMappedByRole(el.role)?.element;

          return [
            el.id,
            el.email,
            el.username,
            el.first_name,
            el.last_name,
            el.languages.join(", "),
            el.participation_type,
            userRoleFromList ? userRoleFromList : el.role,
            el.is_active == true ? "Active" : "Not Active",
            <>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <IconButton size="small" color="primary">
                  <VisibilityIcon
                    onClick={() => navigate(`/profile/${el.id}`)}
                  />
                </IconButton>
                <IconButton size="small" color="primary">
                  <EditOutlinedIcon
                    onClick={() =>
                      handleEditChange(
                        el.id,
                        el.email,
                        el.username,
                        el.first_name,
                        el.last_name,
                        el.languages,
                        el.participation_type,
                        el.role,
                        el.is_active
                      )
                    }
                  />
                </IconButton>
              </div>
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

  return (
    <div>
      {renderSnackBar()}
      {loading && <Spinner />}
      <Grid 
        container
        justifyContent="center" 
        >
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>

        <div ref={tableRef}>
          {isBrowser ? (
            <MUIDataTable
              key={`table-${displayWidth}`}
              title="User Details"
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
                borderRadius: "4px",
                transform: "none",
              }}
            />
          )}
        </div>

      </ThemeProvider>

      {openDialog && (
        <UserInfo
          openDialog={openDialog}
          handleCloseDialog={() => handleCloseDialog()}
          submit={() => handleUpdateEditProfile()}
          Email={email}
          FirstName={firstName}
          userName={userName}
          setUserName={setUserName}
          active={active}
          setActive={setActive}
          setFirstName={setFirstName}
          LastName={lastName}
          setLastName={setLastName}
          Language={language}
          setLanguage={setLanguage}
          ParticipationType={participationType}
          setParticipationType={setParticipationType}
          Role={Role}
          setRole={setRole}
        />
      )}
    </div>
  );
};

export default UserDetail;
