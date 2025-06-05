import React from "react";
import  Grid  from "@mui/material/Grid";
import Modal from "@mui/material/Modal";

export default function SimpleModal(props) {
  const { handleClose, open, top, left, topTranslate, leftTranslate, isTransliteration } = props;


  const getModalStyle = () => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    if (isTransliteration && mediaQuery.matches) {
      return {
        transform:' translate(20%, 25%)',
        position: 'absolute'
      }
    } else if(isTransliteration && !mediaQuery.matches){
      return {
        top: `${top ? top : 50}%`,
        left: `${left ? left : 50}%`,
        position: "absolute",
        transform: `translate(${topTranslate ? topTranslate : "-50"}%, ${leftTranslate ? leftTranslate : "-50"}%)`,
      }
    } else {
      return {
        top: `${top ? top : 50}%`,
        left: `${left ? left : 50}%`,
        position: "absolute",
        transform: `translate(${topTranslate ? topTranslate : "-50"}%, ${leftTranslate ? leftTranslate : "-50"}%)`,
      };
    }


  }

  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal open={open} onClose={handleClose} disableEscapeKeyDown={true}>
      <Grid sx={{
        borderRadius: "5px",
        // position: "absolute",
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
