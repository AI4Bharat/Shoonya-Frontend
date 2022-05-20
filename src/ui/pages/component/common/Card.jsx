import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const CustomCard = ({ title, children, cardContent }) => {
  return (
    <div style={{ width: "30%" }}>
      <Card elevation={3}>
        <CardContent>
          <Typography
            style={{ marginBottom: "15px" }}
            textAlign={"center"}
            variant="h5"
          >
            {title}
          </Typography>
          <Divider />
          {cardContent}
        </CardContent>
        <CardActions style={{ marginBottom: "15px" }}>{children}</CardActions>
      </Card>
    </div>
  );
};

export default CustomCard;
