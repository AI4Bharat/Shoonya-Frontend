import { makeStyles } from '@mui/styles';

const headerStyle = makeStyles({
    parentContainer: {
        // flexGrow : 1,
        marginBottom : window.innerHeight*0.13,
        width : window.innerWidth*0.98,
       
    },
    appBar: {
        // backgroundColor: "#ffffff", 
        // position: 'inherit',
        // marginBotto m : '5%'
    },
    toolbar: {
        justifyContent : "space-between",
        // maxWidth: "1272px",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        padding: "0",
        boxSizing: "border-box",
        minHeight: "54px",
       
      
    },
    menu:{
        width: "100%",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",

    },
    headerLogo: {
        height: "2rem", 
        width: "10rem" 
    },
    headerMenu : {
        textDecoration : "none",
        borderRadius: "inherit",
        backgroundColor: "transparent",
        padding : "15px",
        color: "black",
        boxShadow: "none",
        fontSize: "17px",
        lineHeight : 1.75,
        fontFamily: `"Roboto", "Segoe UI"`, 
        fontWeight: 500,
        letterSpacing: "0.5px",
        borderRadius:3,
        '&:hover': {
            backgroundColor: "#E0E0E0",
            boxShadow: "none",
            
        },
    },
    highlightedMenu : {
        backgroundColor: "#E0E0E0",
        textDecoration : "none",
        borderRadius: "inherit",
        padding : "15px",
        color: "black",
        boxShadow: "none",
        fontSize: "17px",
        lineHeight : 1.75,
        fontFamily: `"Roboto", "Segoe UI"`, 
        fontWeight: 500,
        borderRadius:3,
        letterSpacing: "0.5px",
        '&:hover': {
            backgroundColor: "#E0E0E0",
            boxShadow: "none",
        },
    },
    avatar: {
        width: "36px",
        height: "36px",
        backgroundColor: "#2A61AD",
        fontSize: "14px",
        color: "#FFFFFF",
        "@media (max-width:640px)": {
          width: "26px",
          height: "26px",
        },
      },
})

export default headerStyle