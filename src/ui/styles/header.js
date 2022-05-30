import { makeStyles } from '@mui/styles';
import { Wave } from '../../assets/Wave.svg';


const headerStyle = makeStyles({
    parentContainer: {
        flexGrow : 1,
        marginBottom : window.innerHeight*0.13,
        width : window.innerWidth*(98/100)
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
        height: "30%", 
        width: "30%" 
    }
})

export default headerStyle