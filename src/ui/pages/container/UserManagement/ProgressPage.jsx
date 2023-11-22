import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FetchUserByIdAPI from '../../../../redux/actions/api/UserManagement/FetchUserById';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, CardContent, Box, Chip, Grid, Typography, Switch, Button, FormControlLabel, Tooltip, Paper } from '@mui/material';
import MyProgress from '../../component/Tabs/MyProgress';
import { isSameDay, format } from 'date-fns/esm';
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import RecentTasks from '../../component/Tabs/RecentTasks';
import CustomButton from "../../component/common/Button";
import Spinner from "../../component/common/Spinner";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';
import ToggleMailsAPI from '../../../../redux/actions/api/UserManagement/ToggleMails';
import CustomizedSnackbars from "../../component/common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import FilterListIcon from '@mui/icons-material/FilterList';


const ProfilePage = () => {

  const { id } = useParams();

  const UserDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const formattedDate = UserDetails?.date_joined ? format(new Date(UserDetails.date_joined), 'yyyy-MM-dd HH:mm:ss.SSS') : null;
  const [selectRange, setSelectRange] = useState([{
    startDate: new Date(formattedDate),
    endDate: new Date(),
    key: "selection"
  }]);
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [start_date, setstart_date] = useState();
  const [end_date, setend_date] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const LoggedInUserId = useSelector((state) => state.fetchLoggedInUserData.data.id);
  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
  const handleEmailToggle = async () => {
    setLoading(true);
    const mailObj = new ToggleMailsAPI(LoggedInUserId, !userDetails.enable_mail);
    const res = await fetch(mailObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(mailObj.getBody()),
      headers: mailObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      })
      const userObj = new FetchUserByIdAPI(id);
      dispatch(APITransport(userObj));
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  }

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    console.log(selection, "selection");
    const inputendDate = new Date(`${selection.endDate}`);
    const inputstartDate = new Date(`${selection.startDate}`);

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
    };

    const formatter = new Intl.DateTimeFormat('en-IN', options);
    var formattedendDate = formatter.format(inputendDate);
    var formattedstartDate = formatter.format(inputstartDate);

    setstart_date(format(selection.startDate, 'dd-MM-yyyy'));
    setend_date(format(selection.endDate, 'dd-MM-yyyy'));

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

  useEffect(() => {
    setLoading(true);
    const userObj = new FetchUserByIdAPI(id);
    dispatch(APITransport(userObj));
  }, [id]);

  useEffect(() => {
    if (UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
      setLoading(false);
    }
  }, [UserDetails]);

  return (
    <Grid container spacing={2}>
      {loading && <Spinner />}
      {renderSnackBar()}
      {userDetails && (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
            <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px", backgroundColor: 'ButtonHighlight', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4">{userDetails.organization.title}</Typography>
              </CardContent>
            </Paper>
          </Grid>
          {((userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role) || (LoggedInUserId === userDetails?.id && (userRole.Annotator === loggedInUserData?.role || userRole.Reviewer === loggedInUserData?.role || userRole.SuperChecker === loggedInUserData?.role))) ?
            <>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>

                <Card>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 1 }}>Recent Tasks</Typography>
                    <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              sx={{ width: "130px" }}
              onClick={() => setShowPicker(!showPicker)}
              startIcon={<FilterListIcon/>}
            >
              Filter
            </Button>
          </Grid>
          {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ overflowX: "scroll" }}>
            <DateRangePicker
              onChange={handleRangeChange}
              staticRanges={[
                ...defaultStaticRanges,
                {
                  label: "Till Date",
                  range: () => ({
                    startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
                    endDate: new Date(),
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return (
                      isSameDay(range.startDate, definedRange.startDate) &&
                      isSameDay(range.endDate, definedRange.endDate)
                    );
                  }
                },
              ]}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={selectRange}
              minDate={new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
              maxDate={new Date()}
              direction="horizontal"
            />

          </Card>


        </Box>}


                    <RecentTasks start_date={start_date} end_date={end_date} setstart_date={setstart_date} setend_date={setend_date} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2 }}>
                <Card sx={{ minWidth: 275, borderRadius: "5px" }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 1 }}>My Progress</Typography>
                    <MyProgress />
                  </CardContent>
                </Card>

              </Grid>
            </> :
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 1, display: 'flex', justifyContent: 'center', color: 'red' }}>
              <Typography variant="h4" sx={{ mb: 1 }}>{"Not Authorised to View Details"}</Typography>
            </Grid>
          }
        </>
      )
      }
    </Grid >
  )
}

export default ProfilePage;
