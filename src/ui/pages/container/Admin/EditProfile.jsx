import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CustomButton from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import { MenuProps } from "../../../../utils/utils";
import UserRolesList from "../../../../utils/UserMappedByRole/UserRolesList";

const participationTypes = [
  { name: "FULL TIME", value: 1 },
  { name: "PART TIME", value: 2 },
  { name: "NA", value: 3 },
  { name: "CONTRACT", value: 4 },
];

const EditProfile = (props) => {
  const {
    submit,
    Email,
    FirstName,
    LastName,
    Language,
    ParticipationType,
    Role,
    handleCloseDialog,
    setRole,
    userName,
    setUserName,
    setActive,
    active,
    setFirstName,
    setLastName,
    setLanguage,
    setParticipationType,
  } = props;
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [languageOptions, setLanguageOptions] = useState([]);

  const LanguageList = useSelector((state) => state.fetchLanguages.data);

  const getLanguageList = () => {
    const langObj = new FetchLanguagesAPI();

    dispatch(APITransport(langObj));
  };

  useEffect(() => {
    getLanguageList();
  }, []);

  useEffect(() => {
    if (LanguageList) {
      setLanguageOptions(LanguageList.language);
    }
  }, [LanguageList]);

  return (
    <Grid>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Edit Profile
      </Typography>

      <Grid
        container
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <OutlinedTextField
            label="First Name"
            placeholder="First Name"
            sx={{
              m: 1,
              input: { color: "rgba(0, 0, 0, 0.6)", fontSize: "16px" },
            }}
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <OutlinedTextField
            label="UserName"
            placeholder="UserName"
            sx={{
              m: 1,
              input: { color: "rgba(0, 0, 0, 0.6)", fontSize: "16px" },
            }}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <OutlinedTextField
            label="Last Name"
            placeholder="Last Name"
            sx={{
              m: 1,
              input: { color: "rgba(0, 0, 0, 0.6)", fontSize: "16px" },
            }}
            value={LastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <OutlinedTextField
            disabled
            label="Email"
            placeholder="Email"
            sx={{
              m: 1,
              input: { color: "rgba(0, 0, 0, 0.6)", fontSize: "16px" },
            }}
            value={Email}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <FormControl sx={{ m: 1, minWidth: 210 }}>
            <InputLabel
              id="lang-label"
              style={{
                fontSize: "1.25rem",
                zIndex: "1",
                position: "absolute",
                display: "block",
                transform: "translate(14px, -9px) scale(0.75)",
                backgroundColor: "white",
                paddingLeft: "4px",
                paddingRight: "4px",
              }}
            >
              Languages
            </InputLabel>

            <Select
              multiple
              fullWidth
              labelId="lang-label"
              name="languages"
              value={Language ? Language : []}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ zIndex: "0" }}
              MenuProps={MenuProps}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {languageOptions?.length &&
                languageOptions.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <FormControl sx={{ m: 1, minWidth: 210 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Participation Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={ParticipationType}
              label="Participation Type"
              onChange={(e) => setParticipationType(e.target.value)}
              sx={{
                textAlign: "left",
              }}
              MenuProps={MenuProps}
            >
              {participationTypes &&
                participationTypes.length > 0 &&
                participationTypes.map((el, i) => {
                  return <MenuItem value={el.value}>{el.name}</MenuItem>;
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <FormControl sx={{ m: 1, minWidth: 210 }}>
            <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={Role}
              label="Role"
              //onChange={(e) => setRole(e.target.value)}
              onChange={(e) => {
                const newRole = e.target.value;
                const currentRole = Role; 
                if (newRole < currentRole) {
                  alert("Warning: Demoting someone’s role on the platform may cause inconsistencies and is not advised. Please check with platform admins on this");
                }
                setRole(newRole);
              }}
              sx={{
                textAlign: "left",
              }}
              MenuProps={MenuProps}
            >
              {Object.keys(UserRolesList).map((el) => (
                <MenuItem key={el} value={el}>
                  {UserRolesList[el]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mb: 2 }}>
          <FormControl sx={{ m: 1, minWidth: 210 }}>
            <InputLabel id="demo-simple-select-helper-label">Active_status</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={active}
              label="Active_Status"
              onChange={(e) => setActive(e.target.value)}
              sx={{
                textAlign: "left",
              }}
              MenuProps={MenuProps}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Not Active</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid sx={{ textAlignLast: "end" }}>
        <CustomButton
          label={translate("button.submit")}
          onClick={() => submit()}
          //disabled={SourceText && targetText && domain ? false : true}
          sx={{
            borderRadius: 2,
            textDecoration: "none",
          }}
        />
        <CustomButton
          label={translate("button.cancel")}
          onClick={handleCloseDialog}
          sx={{
            ml: 1,
            borderRadius: 2,
            textDecoration: "none",
          }}
        />
      </Grid>
    </Grid>
  );
};
export default EditProfile;
