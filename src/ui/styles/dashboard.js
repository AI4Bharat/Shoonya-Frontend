import { makeStyles } from '@mui/styles';

const dashboardStyle = makeStyles({
    parentContainer: {
        minHeight: "100vh",
        // direction: "row",
        alignItems: "center",
        paddingBottom : "5vh",
        // justifyContent: "space-around",
        flexGrow : 0
    },
    projectCardContainer1 : {
        backgroundColor: "#2A61AD",
        height : "100%",
        width : "100%"
        
    },
    projectCardContainer2 : {
        backgroundColor : "#119DA4",
        height : "100%",
        width : "100%"
    },
    userCardContainer: {
        direction: "column",
        alignItems: "center",
        height: "100%",
        placeContent: "center"
    },
    dashboardContentContainer: {
        alignItems: "left",
        justifyContent: "space-around",
        minHeight: "70vh",
        borderLeft: '1px solid lightgray',
        paddingLeft: '5%'
    }
    // userIntroCard : {
    //     background: `url(${Wave})`,
    //     backgroundColor : 'red'
    // }
})

export default dashboardStyle