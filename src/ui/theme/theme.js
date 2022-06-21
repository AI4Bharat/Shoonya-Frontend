import { createTheme } from "@mui/material/styles";
import Card from "../../assets/Card.svg";

const themeDefault = createTheme({
  palette: {
    primary: {
      light: "#60568d",
      main: "#2C2799",
      dark: "#271e4f",
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#FFFFFF",
      main: "#FFFFFF",
      dark: "#FFFFFF",
      contrastText: "#000000",
    },
    background: {
      default: "#2C2799",
    },
  },
  typography: {
    fontFamily: '"Roboto"',
    fontWeight: "400",
    h1: {
      fontSize: "3.125rem",
      fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
      fontWeight: "300",
      "@media (max-width:550px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "2.5rem",
      fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
      fontWeight: "300",
      "@media (max-width:550px)": {
        fontSize: "1.5rem",
      },
    },
    h3: {
      fontSize: "1.6875rem",
      fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
      fontWeight: "300",
      letterSpacing: "0px",
      "@media (max-width:550px)": {
        fontSize: "1.3rem",
      },
    },
    h4: {
      fontSize: "1.5rem",
      fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
      fontWeight: "300",
      "@media (max-width:550px)": {
        fontSize: "0.9rem",
      },
    },
    h5: {
      fontSize: "1.3125rem",
      fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
      fontWeight: "300",
      "@media (max-width:550px)": {
        fontSize: "1rem",
      },
    },
    h6: {
      fontSize: "1.125rem",
      fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
      fontWeight: "300",
      paddingTop: "4px",
      "@media (max-width:550px)": {
        fontSize: "1rem",
      },
    },
    body1: {
      fontSize: "1.25rem",
      fontFamily: '"Roboto", sans-serif ,sans-serif',
      fontWeight: "400",
    },
    body2: {
      fontSize: "0.875rem",
      fontFamily: '"Roboto", sans-serif',
      fontWeight: "400",
      color: "#0C0F0F",
      lineHeight: "22px",
    },
    caption: {
      fontSize: "0.75rem",
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "400",
      color : "#3A3A3A"
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "400",
      "@media (max-width:550px)": {
        fontSize: ".9rem",
      },
    },
    subtitle2: {
      fontSize: "1rem",
      fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
      fontWeight: "300",
      "@media (max-width:550px)": {
        fontSize: ".7rem",
      },
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-child(odd)": {
            backgroundColor: "#D6EAF8",
          },
          "&:nth-child(even)": {
            backgroundColor: "#E9F7EF",
          },
          "&.MuiTableRow-hover:hover:nth-of-type(odd)": {
            backgroundColor: "#D6EAF8",
          },
          "&.MuiTableRow-hover:hover:nth-of-type(even)": {
            backgroundColor: "#E9F7EF",
          },
          "&.MuiTableRow-footer": {
            backgroundColor: "#fff",
          },
        },
      },
    },
    MUIDataTablePagination: {
      styleOverrides: {
        backgroundColor: "#fff",
      },
    },
    MUIDataTableFilterList: {
      styleOverrides: {
        chip: {
          display: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          minWidth: "210px",
        },
      },
    },
    MUIDataTableFilter: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          width: "80%",
          fontFamily: '"Roboto" ,sans-serif',
        },
        checkboxFormControl: {
          minWidth: "200px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
            fontSize: "0.875rem",
          "@media (max-width:670px)": {
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto" ,sans-serif',
        },
        padding: {
          "@media (max-width:670px)": {
            padding: "0px",
            paddingLeft: "9px",
          },
        },
      },
    },
    MUIDataTable: {
      styleOverrides: {
        paper: {
          minHeight: "674px",
          boxShadow: "0px 0px 2px #00000029",
          border: "0",
        },
        responsiveBase: {
          minHeight: "560px",
        },
      },
    },
    MUIDataTableToolbar: {
      styleOverrides: {
        filterPaper: {
          width: "310px",
        },
        MuiButton: {
          root: {
            display: "none",
          },
        },
      },
    },
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          padding: ".5rem .5rem .5rem .8rem",
          textTransform: "capitalize",
        },

        stackedParent: {
          "@media (max-width: 400px)": {
            display: "table-row",
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        grid: {
          maxWidth: "100%",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          padding: ".6rem .5rem .6rem 1.5rem",
          backgroundColor: "#F8F8FA !important",
          marginLeft: "25px",
          letterSpacing: "0.74",
          fontWeight: "bold",
          minHeight: "700px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none !important",
          borderRadius: 0,
          border: "1px solid rgb(224 224 224)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { minWidth: "360px", minHeight: "116px" },
      },
    },
    MuiAvatar : {
        styleOverrides : {
            root : {
                backgroundColor : "#271e4f",
                color : "#FFFFFF"
            }
        }
    },
    MuiIconButton : {
        styleOverrides : {
            root : {
                borderRadius : "5%"
            }
        }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
          margin: "-1px",
          padding: "0px",
          backgroundImage: "linear-gradient(to right, #f1f1f1, #ffffff)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          height: "36px",
        },
        label: {
          fontFamily: '"Roboto" ,sans-serif',
          fontSize: "0.875rem",
          "@media (max-width:640px)": {
            fontSize: "10px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "25",
          borderRadius: "none",
          textTransform: "none",
        },
        label: {
          textTransform: "none",
          fontFamily: '"Roboto", "Segoe UI"',
          fontSize: "16px",
          letterSpacing: "0.16px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          height: "19px",
          "@media (max-width:640px)": {
            fontSize: "10px",
          },
        },
        sizeLarge: {
          height: "40px",
          borderRadius: "20px",
        },
        sizeMedium: {
          height: "40px",
          borderRadius: "20px",
        },
        sizeSmall: {
          height: "30px",
          borderRadius: "20px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#FD7F23",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          width: "auto",
          fontSize: "18px",
          fontWeight: "600",
          letterSpacing: "0px",
          fontFamily: "Roboto",
          padding: "0",
          textTransform : "none",
          marginRight: "28px",
          opacity: 1,
          color: "#3A3A3A",
          "&.Mui-selected": {
            color: "#3A3A3A",
          },
          "@media (min-width:600px)": {
            minWidth: "auto",
          },
          "@media (max-width:600px)": {
            marginRight: "20px",
            minWidth: "auto",
          },
          "@media (max-width:550px)": {
            fontSize: "1rem",
          },
        },
        textColorInherit: {
          color: "#3A3A3A",
          opacity: 1,
          "&.Mui-selected": {
            fontWeight: "bold",
          },
        },
        wrapper: {
          alignItems: "flex-start",
          textTransform: "none",
        },
      },
    },
    MuiBox: {
      root: {
        padding: "24px 0px",
      },
    },
    MUIDataTableBodyRow: {
      root: {
        "&:nth-of-type(odd)": {
          backgroundColor: "#D6EAF8",
        },
        "&:nth-of-type(even)": {
          backgroundColor: "#E9F7EF",
        },
      },
    },
    MUIDataTableFilterList: {
      chip: {
        display: "none",
      },
    },
    MUIDataTable: {
      paper: {
        minHeight: "674px",
        boxShadow: "0px 0px 2px #00000029",
        border: "1px solid #0000001F",
      },
      responsiveBase: {
        minHeight: "560px",
      },
    },
    MUIDataTableToolbar: {
      filterPaper: {
        width: "310px",
      },
      MuiButton: {
        root: {
          display: "none",
        },
      },
    },
    MUIDataTableFilter: {
      root: {
        backgroundColor: "white",
        width: "80%",
        fontFamily: '"Roboto" ,sans-serif',
      },
      checkboxFormControl: {
        minWidth: "200px",
      },
    },
    MUIDataTableHeadCell: {
      root: {
        "&:nth-of-type(1)": {
          width: "25%",
        },
        "&:nth-of-type(2)": {
          width: "18%",
        },
        "&:nth-of-type(3)": {
          width: "18%",
        },
        "&:nth-of-type(4)": {
          width: "18%",
        },
      },
    },
    MUIDataTableBodyCell: {
      root: { padding: ".5rem .5rem .5rem .8rem", textTransform: "capitalize" },
    },
  },
});

themeDefault.container = {
  backgroundImage: `url(${Card})`,
};

themeDefault.typography.lightText = {
  fontSize: "0.75rem",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: "400",
  color: "rgb(255 255 255 / 82%)",
};

export default themeDefault;
