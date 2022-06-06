import { Grid, Link, Typography } from "@mui/material";
import { translate } from "../../../../config/localisation";
import history from "../../../../web.history";
import Button from "../../component/common/Button";

const Landing = () => {
  const onClickHandler = () => {
    history.push(`${process.env.PUBLIC_URL}/login`);
  };
 console.log('Test..')
 
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
      spacing={1}
    >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <img src={"ai4bharat.png"} alt="logo" />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h4" component={"p"}>
          {translate("landlingPageLabel")}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Link href="/login">
          <Button label="Login" />
        </Link>
      </Grid>
    </Grid>
  );
};

export default Landing;
