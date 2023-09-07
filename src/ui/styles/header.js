import { makeStyles } from '@mui/styles';
import { padding } from '@mui/system';

const headerStyle = makeStyles({
    parentContainer: {
        // flexGrow : 1,
        marginBottom : window.innerHeight*0.13,
        width : window.innerWidth*0.98,
      
       
    },
    AudioparentContainers:{
        marginBottom : window.innerHeight*0.1,
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
        // padding: "inherit !important",
        padding:"0px !important",
        boxSizing: "border-box",
        minHeight: "54px",
        fontFamily: '"Roboto" ,sans-serif',
      
    },
    menu:{
        maxWidth: "1272px",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
     

    },
    headerLogo: {
        height: "35px", 
        width: "40px", 
        borderRadius:"50%"
    },
    headerTitle:{
        color:"#373939",
        display: "inline-block",
        letterSpacing:"1px",
        paddingLeft:"3px"
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
        borderRadius:12,
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
        borderRadius:12,
        letterSpacing: "0.5px",
        '&:hover': {
            backgroundColor: "#E0E0E0",
            boxShadow: "none",
        },
    },
    avatar: {
        width: "36px",
        height: "36px",
        backgroundColor: "#2A61AD !important",
        fontSize: "14px",
        color: "#FFFFFF !important",
        "@media (max-width:640px)": {
          width: "26px",
          height: "26px",
        },
      },
})

export default headerStyle