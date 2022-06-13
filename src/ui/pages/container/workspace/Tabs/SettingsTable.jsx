import React from 'react';
import Button from "../../../component/common/Button";
import DatasetStyle from "../../../../styles/Dataset";

export default function SettingsTable() {
    const classes = DatasetStyle();
  return (
    <div>
       <Button className={classes.settingsButton}  label={"Archive Workspace"} />
    </div>
  )
}
