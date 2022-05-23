import { makeStyles } from '@mui/styles';
import { Wave } from '../../assets/Wave.svg';


const dashboardStyle = makeStyles({
    parentContainer: {
        minHeight: "100vh",
        direction: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
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
        minHeight: "60vh",
        borderLeft: '1px solid lightgray',
        paddingLeft: '5%'
    }
    // userIntroCard : {
    //     background: `url(${Wave})`,
    //     backgroundColor : 'red'
    // }
})

export default dashboardStyle