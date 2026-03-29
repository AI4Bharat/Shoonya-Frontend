import React, { useState } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import SuperCheckSettingsAPI from "../../../../redux/actions/api/ProjectDetails/SuperCheckSettings";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";


export default function SuperCheckSettings(props) {
    const{ProjectDetails}=props
    const classes = DatasetStyle();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [supercheckLoopCount, setSupercheckLoopCount] = useState(ProjectDetails.revision_loop_count);
    const [supercheckvalue, setSupercheckvalue] = useState(ProjectDetails.k_value);
    const [loading, setLoading] = useState(false);


    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = async () => {
        const data = {
            revision_loop_count: supercheckLoopCount,
            k_value: supercheckvalue
        }
        setAnchorEl(null);
        setSupercheckLoopCount();
        setSupercheckvalue();
        let projectObj = new SuperCheckSettingsAPI(id, data)
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "PATCH",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: "success",
                variant: "success",
            })

        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }
    }



    const open = Boolean(anchorEl);
    const Id = open ? 'simple-popover' : undefined;

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
        <div >
            {renderSnackBar()}
            <Button
                sx={{
                    borderRadius: 3,
                    width: "100%"
                }}
                aria-describedby={Id}
                variant="contained"
                onClick={handleClick}
            >
                Super Check Settings
            </Button>

            <Popover
                Id={Id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                PaperProps={{
                    style: { width: '330px' },
                  }}
            >


                <Grid
                    container
                    direction="row"
                    sx={{
                        alignItems: "center",
                        p: 1,
                        mt:2

                    }}
                >
                    <Grid items xs={12} sm={12} md={9} lg={9} xl={9}>
                        <Typography variant="body2" fontWeight="700" label="Required">
                            Super Checking K% value:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9} xl={9} sm={12}>
                        <TextField
                            size="small"
                            variant="outlined"
                            value={supercheckvalue}
                            onChange={(e) => setSupercheckvalue(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px"
                                }
                            }}
                        />

                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    sx={{
                        alignItems: "center",
                        p: 1,

                    }}
                >
                    <Grid items xs={12} sm={12} md={9} lg={9} xl={9}>
                        <Typography variant="body2" fontWeight="700" label="Required">
                            Super Check Revision Loop Count :
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9} xl={9} sm={12}>
                        <TextField
                            size="small"
                            variant="outlined"
                            value={supercheckLoopCount}
                            onChange={(e) => setSupercheckLoopCount(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px"

                                }
                            }}
                        />

                    </Grid>
                </Grid>


                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.submit")}
                    </Button>
                </Box>
            </Popover>

        </div>
    );
}
