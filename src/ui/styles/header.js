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
        maxWidth: "1272px",
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
    }
})

export default headerStyle