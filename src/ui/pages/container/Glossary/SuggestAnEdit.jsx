import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  MenuItem,
  DialogContent,
  Dialog,
  DialogContentText,
  Typography,
} from "@mui/material";
import CustomButton from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import getDomains from "../../../../redux/actions/api/Glossary/GetDomains";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import CustomizedSnackbars from "../../../pages/component/common/Snackbar";
import SuggestAnEditAPI from "../../../../redux/actions/api/Glossary/SuggestAnEdit";

const SuggestAnEdit = ({
  openDialog,
  handleCloseDialog,
  TargetText,
  sourceText,
  Domain,
  hashCode,
  data
}) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const [SourceText, setSourceText] = useState(sourceText);
  const [targetText, settargetText] = useState(TargetText);
  const [domain, setdomain] = useState(Domain);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const allDomains = useSelector((state) => state.getDomains);
console.log(data,"data")

  useEffect(() => {
    const domainApiObj = new getDomains();
    dispatch(APITransport(domainApiObj));
  }, []);

  const onSubmit = async () => {
    const SuggestAnEditData = {
      SourceText: SourceText,
      targetText: targetText,
      domain: domain,
      hashCode: hashCode,
    };

    const GlossaryObj = new SuggestAnEditAPI();
    dispatch(APITransport(GlossaryObj));
  };

  const handleTargetTextChange = (e) => {
    settargetText(e.target.value);
  };
  const handleDomainChange = (e) => {
    setdomain(e.target.value);
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
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid>
            <Grid>{renderSnackBar()}</Grid>
            <Card className={classes.SuggestAnEditCard}>
            <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{ mb: 3 }}
              >
                Suggest An Edit 
              </Typography>
              <Grid
                container
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <OutlinedTextField
                  label="Source Text"
                  placeholder="Source Text"
                  sx={{ m: 1, width: 200 }}
                  value={SourceText}
                />
                <OutlinedTextField
                  label="Target Text"
                  placeholder="Target Text"
                  sx={{ m: 1, width: 200 }}
                  value={targetText}
                  onChange={handleTargetTextChange}
                />
              </Grid>
              <Grid
                container
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                sx={{
                  mt: 4,
                }}
              >
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Domain
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={domain}
                    label="Domain"
                    onChange={handleDomainChange}
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    {allDomains &&
                      allDomains.length > 0 &&
                      allDomains.map((el, i) => {
                        return <MenuItem value={el.code}>{el.label}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
                <Grid sx={{ m: 1, minWidth: 200 }}></Grid>
              </Grid>

              <Grid sx={{ textAlignLast: "end" }}>
                <CustomButton
                  label={translate("button.submit")}
                  onClick={onSubmit}
                  disabled={SourceText && targetText && domain ? false : true}
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
            </Card>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
export default SuggestAnEdit;
