import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const CustomizedSnackbars = (props) => {

    const getMuiTheme = () => createTheme({
        components: {
            MuiSnackbar: {
                styleOverrides:{
                    anchorOriginTopRight: {
                        marginTop: "50px"
                    }
                }
            }
        }
    });

    return (
        <MuiThemeProvider theme={getMuiTheme()}>
                <Snackbar
                    autoHideDuration={props.hide? props.hide : 10000}
                    open={props.open}
                    onClose={props.handleClose}
                    anchorOrigin={props.anchorOrigin}
                >
                    <Alert elevation={3}
                        variant="filled"
                        onClose={props.handleClose}
                        severity={props.variant}>
                        {props.message}
                    </Alert>
                </Snackbar>
        </MuiThemeProvider>
    );
}

export default CustomizedSnackbars;
