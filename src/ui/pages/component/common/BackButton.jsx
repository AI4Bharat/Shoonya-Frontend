import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

const BackButton = ({ label, ...rest }) =>{
  const navigate = useNavigate();
  return (
    <>
     <Button {...rest} variant="contained" color="primary" onClick={() => navigate(-1)}>
      {label}
    </Button>
     </>
  );
}
  
export default  BackButton;