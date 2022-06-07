import { makeStyles } from '@mui/styles';

const projectCardStyles = makeStyles({
    projectCardContainer: {
        cursor: 'pointer'
    },
    modelname: {
        boxSizing: "border-box",
        // marginTop: "15px",
        height: "64px",
        backgroundColor: "white",
        maxWidth: "90%",
        minWidth:'90%',
        width: "auto",
        display: "flex",
        alignItems: "center",
        padding: "0 15px",
        borderRadius: "12px",
      },
})

export default projectCardStyles