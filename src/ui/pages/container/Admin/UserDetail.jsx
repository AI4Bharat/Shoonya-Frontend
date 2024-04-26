import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid, IconButton } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import GetUserDetailAPI from "../../../../redux/actions/api/Admin/UserDetail";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';
import UserInfo from "./UserInfo";
import Spinner from "../../component/common/Spinner";
import GetUserDetailUpdateAPI from "../../../../redux/actions/api/Admin/EditProfile";
import { el } from "date-fns/locale";

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
  const [userName,setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [language, setLanguage] = useState([]);
  const [participationType, setParticipationType] = useState("");
  const [Role, setRole] = useState("");

  const UserDetail = useSelector((state) => state.getUserDetails.data);
  console.log(UserDetail);
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const SearchUserDetail = useSelector(
    (state) => state.SearchProjectCards.data
  );
  const getUserDetail = () => {
    setLoading(true);
    const UserObj = new GetUserDetailAPI();
    dispatch(APITransport(UserObj));
  };

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
    is_active,
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
      email:email,
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
      const searchValue = SearchUserDetail.toLowerCase();
      if (
        searchValue === "" ||
        el.email?.toLowerCase().includes(searchValue) ||
        el.username?.toLowerCase().includes(searchValue) ||
        el.first_name?.toLowerCase().includes(searchValue) ||
        el.last_name?.toLowerCase().includes(searchValue) ||
        el.participation_type.toString().toLowerCase().includes(searchValue) ||
        el.languages?.some((val) => val?.toLowerCase().includes(searchValue)) ||
        ((el.is_active === true && searchValue === "active") ||
        (el.is_active === false && searchValue === "not active")) ||
        (searchValue === "not" && !el.is_active) // Recommend "not active" when searching for "not"
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
    },
    {
      name: "username",
      label: "UserName",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },
    {
      name: "first_name",
      label: "First Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { paddingLeft: "30px" } }),
      },
    },
    {
      name: "languages",
      label: "Languages",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { paddingLeft: "30px" } }),
      },
    },
    {
      name: "participation_type",
      label: "Participation Type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { paddingLeft: "40px" , paddingRight: "30px" } }),
      },
    },
    {
      name: "role",
      label: "Role",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },
    {
      name: "is_active",
      label: "Active Status",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { paddingLeft: "30px" , paddingRight: "30px"} }),
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: {paddingLeft: "10px" , paddingRight: "20px"}} ),
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
            el.is_active==true?"Active":"Not Active",
            <>
              <div style={{display:"flex", flexDirection:"row"}}>
              <IconButton size="small" color="primary">
                <VisibilityIcon onClick={()=>navigate(`/profile/${el.id}`)} />
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
                      el.is_active,
                    )
                  }
                />
              </IconButton>
              </div>
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
      {loading && <Spinner />}
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title="User Details"
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>

      {openDialog && (
        <UserInfo
          openDialog={openDialog}
          handleCloseDialog={() => handleCloseDialog()}
          submit={() => handleUpdateEditProfile()}
          Email={email}
          FirstName={firstName}
          userName = {userName}
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