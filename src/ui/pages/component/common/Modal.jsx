import React from "react";
import { Grid } from "@mui/material";
import Modal from "@mui/material/Modal";

export default function SimpleModal(props) {
  const { handleClose, open, top, left, topTranslate, leftTranslate } = props;
  

  const getModalStyle = () => {
    // const top = 50;
    // const left = 50;
  
    return {
      top: `${top ? top : 50}%`,
      left: `${left ? left : 50}%`,
      transform: `translate(${topTranslate ? topTranslate : "-50"}%, ${leftTranslate ? leftTranslate : "-50"}%)`,
    };
  }

  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal open={open} onClose={handleClose}>
      <Grid sx={{
        borderRadius: "5px",
        position: "absolute",
         backgroundColor: "#FFFFFF",
        //  boxShadow: theme.shadows[5],
        padding: 1,
        // width: "auto",
      }}
      style={modalStyle}
      >
          {props.children}
      </Grid>
    </Modal>
  );
}