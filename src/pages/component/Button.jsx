import { Button } from "@mui/material";

const CustomButton = ({ label, ...rest }) => (
  <Button {...rest} variant="contained" color="primary">
    {label}
  </Button>
);

export default CustomButton;
