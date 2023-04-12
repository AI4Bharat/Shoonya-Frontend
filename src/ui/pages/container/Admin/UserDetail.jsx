import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid, Button } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import GetUserDetailAPI from "../../../../redux/actions/api/Admin/UserDetail";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
  const [email, setEmail] = useState("");
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
    first_name,
    last_name,
    languages,
    participation_type,
    role
  ) => {
    setOpenDialog(true);
    setId(id);
    setEmail(email);
    setFirstName(first_name);
    setLastName(last_name);
    setLanguage(languages);
    setParticipationType(participation_type);
    setRole(role);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateEditProfile = async () => {
    const data = {
      email:email,
      first_name: firstName,
      last_name: lastName,
      languages: language,
      participation_type: participationType,
      role: Role,
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
        el.first_name?.toLowerCase().includes(SearchUserDetail?.toLowerCase())
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
        setCellProps: () => ({ style: { paddingLeft: "70px" } }),
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
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ style: { paddingLeft: "30px" } }),
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
            el.first_name,
            el.last_name,
            el.languages.join(", "),
            el.participation_type,
            userRoleFromList ? userRoleFromList : el.role,
            <>
              <Button>
                <EditOutlinedIcon
                  onClick={() =>
                    handleEditChange(
                      el.id,
                      el.email,
                      el.first_name,
                      el.last_name,
                      el.languages,
                      el.participation_type,
                      el.role
                    )
                  }
                />
              </Button>
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
