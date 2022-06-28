import { Button } from "@mui/material";

const CustomButton = ({ label, buttonVariant, color, ...rest }) => (
  <Button {...rest} variant={buttonVariant ? buttonVariant : "contained"} color={color ? color : "primary"}>
    {label}
  </Button>
);

export default CustomButton;
