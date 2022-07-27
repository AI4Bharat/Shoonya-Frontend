import React from "react";
import { Grid } from "@mui/material";
import Modal from "@mui/material/Modal";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}



export default function SimpleModal(props) {
  const { handleClose, open } = props;
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal open={open} onClose={handleClose}>
      <Grid sx={{
        borderRadius: "5px",
        position: "absolute",
         backgroundColor: "#FFFFFF",
        //  boxShadow: theme.shadows[5],
        padding: 5,
        // width: "auto",
      }}
      style={modalStyle}
      >
          {props.children}
      </Grid>
    </Modal>
  );
}


