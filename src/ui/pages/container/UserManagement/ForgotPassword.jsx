import CustomCard from "../../component/common/Card";
import { Grid } from "@mui/material";
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import { translate } from "../../../../config/localisation";

const forgotPassword = () => {

  const TextFields = () => {
    return (
      <Grid container spacing={2} style={{ marginTop: "2px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            placeholder={translate("enterEmailId")}
          />
        </Grid>
      </Grid>
    );
  };

  const renderCardContent = () => (
    <CustomCard title={"Reset your Password"} cardContent={<TextFields />}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button fullWidth label={"Submit"} />
        </Grid>
      </Grid>
    </CustomCard>
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderCardContent()}
    </div>
  );
};

export default forgotPassword;
