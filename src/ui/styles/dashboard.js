import { makeStyles } from '@mui/styles';
import { Wave } from '../../assets/Wave.svg';


const dashboardStyle = makeStyles({
    parentContainer: {
        minHeight: "100vh",
        // direction: "row",
        alignItems: "center",
        paddingBottom : "5vh"
        // justifyContent: "space-around",
    },
    projectCardContainer1 : {
        backgroundImage: "linear-gradient(to right, #d030c4, #660867a1)",
        height : "100%",
        width : "100%"
        
    },
    projectCardContainer2 : {
        // backgroundImage : "linear-gradient(to right, #d030c4, #660867a1)",
        backgroundImage : "linear-gradient(to right, #c593fb, #660867)",
        // backgroundImage: "linear-gradient(to right, #43e97b, #38f9d7)",
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