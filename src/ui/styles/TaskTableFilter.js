import { makeStyles } from '@mui/styles';

const TaskTableFilter = makeStyles({
    clearAllBtn: {
        float: "right",
        margin: "9px 16px 0px auto",
        padding: "0",
        height: "15px",
      },
      filterContainer: {
        borderBottom: "1px solid #00000029",
        paddingLeft: "18.5px",
        marginTop: "20px",
        width: "600px",
        maxHeight: "270px",
        overflow: "auto",
        "@media (max-width:550px)": {
          width: "330px",
          maxHeight: "170px",
        },
      },
      statusFilterContainer : {
        // display : 'contents',
        alignItems: "center",
      },
      filterTypo: {
        // marginBottom: "9px",
        // marginRight : "20px"
      },
      applyBtn: {
        float: "right",
        borderRadius: "20px",
        margin: "9px 16px 9px auto",
        width: "80px",
      },
      clrBtn: {
        float: "right",
        borderRadius: "20px",
        margin: "9px 10px 9px auto",
        width: "100px",
      },
      menuStyle: {
        padding: "0px",
        justifyContent: "left",
        fontSize: "1.125rem",
        fontWeight: "500 !important",
    
        "&:hover": {
          backgroundColor: "white",
        },
        borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
        // borderTop:"3px solid green",
        "& svg": {
          marginLeft: "auto",
          color: "rgba(0, 0, 0, 0.42)",
        },
      },
  });
  
  export default TaskTableFilter;
  