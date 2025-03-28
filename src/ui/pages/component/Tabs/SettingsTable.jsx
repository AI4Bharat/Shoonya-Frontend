import React from 'react';
import Button from "../../../component/common/Button";
import DatasetStyle from "../../../../styles/Dataset";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function SettingsTable() {
    const classes = DatasetStyle();
  return (
    <div className={classes.settingsdiv}  >
      <Card>
      <CardContent>
      <Button className={classes.settingsButton}  label={"Archive Workspace"} buttonVariant="outlined" color="error" />
      </CardContent>
    </Card>
       
    </div>
  )
}
