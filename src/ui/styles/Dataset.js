import { makeStyles } from '@mui/styles';
import { Wave } from '../../assets/Wave.svg';


const DatasetStyle = makeStyles({
 
  Projectsettingtextarea:{
    width: "100%",
    fontSize: "1.4rem",
    fontFamily: "Roboto",
    fontWeight: 10,
    lineHeight: 1.2,

   },
   workspaceTables:{
    marginTop:"20px"
   },
   projectButton:{
    width: "40%",
   },
   annotatorsButton:{
    width: "100%"
   },
   managersButton:{
    width: "100%"
   },
   settingsButton:{
    width: "100%",
    backgroundColor:"red"
   },
   workspaceCard:{
    width: window.innerWidth * 0.8,
    minHeight: "500px",
    padding: "40px"
   },
   projectsettingGrid:{
    margin: "20px 0px 10px 0px",

   }
  
})

export default DatasetStyle