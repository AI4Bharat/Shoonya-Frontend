import { Button } from "@mui/material";

const CustomButton = ({ label, buttonVariant, ...rest }) => (
  <Button {...rest} variant={buttonVariant ? buttonVariant : "contained"} color="primary">
    {label}
  </Button>
);

export default CustomButton;
