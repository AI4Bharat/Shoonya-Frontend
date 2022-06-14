import React from 'react';
import Button from "../../../component/common/Button";
import DatasetStyle from "../../../../styles/Dataset";
import { Box, Card, Grid, Tab, Tabs,CardContent, ThemeProvider, Typography } from "@mui/material";

export default function SettingsTable() {
    const classes = DatasetStyle();
  return (
    <div className={classes.settingsdiv} style={{}} >
      <Card>
      <CardContent>
      <Button className={classes.settingsButton}  label={"Archive Workspace"} />
      </CardContent>
    </Card>
       
    </div>
  )
}
