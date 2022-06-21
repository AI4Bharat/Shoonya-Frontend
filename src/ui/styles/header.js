import { makeStyles } from '@mui/styles';

const headerStyle = makeStyles({
    parentContainer: {
        // flexGrow : 1,
        marginBottom : window.innerHeight*0.13,
        width : window.innerWidth*0.98
    },
    appBar: {
        // backgroundColor: "#ffffff", 
        // position: 'inherit',
        // marginBotto m : '5%'
    },
    toolbar: {
        justifyContent : "space-between"
    },
    headerLogo: {
        height: "2rem", 
        width: "10rem" 
    },
    headerMenu : {
        textDecoration : "none",
        borderRadius: "inherit",
        backgroundColor: "transparent",
        padding : "18px ",
        color: "black",
        boxShadow: "none",
        fontSize: "19px",
        fontFamily: "Roboto", 
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
        padding : "18px ",
        color: "black",
        boxShadow: "none",
        fontSize: "19px",
        fontFamily: "Roboto", 
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