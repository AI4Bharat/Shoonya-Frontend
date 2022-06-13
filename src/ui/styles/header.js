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
        padding : "10px",
        color: "black",
        boxShadow: "none",
        fontSize: "19px",
        '&:hover': {
            backgroundColor: "#E0E0E0",
            boxShadow: "none",
        },
    },
    highlightedMenu : {
        backgroundColor: "#E0E0E0",
        textDecoration : "none",
        borderRadius: "inherit",
        padding : "10px",
        color: "black",
        boxShadow: "none",
        fontSize: "19px",
        '&:hover': {
            backgroundColor: "#E0E0E0",
            boxShadow: "none",
        },
    }
})

export default headerStyle