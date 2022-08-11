import { Button } from "@mui/material";

const CustomButton = ({ label, buttonVariant, disabled=false, color, ...rest }) => (
  <Button {...rest} variant={buttonVariant ? buttonVariant : "contained"} color={color ? color : "primary"} disabled={disabled}>
    {label}
  </Button>
);

export default CustomButton;
