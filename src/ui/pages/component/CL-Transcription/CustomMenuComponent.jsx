import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  playbackSpeed,

} from "../../../../utils/SubTitlesUtils";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckIcon from "@mui/icons-material/Check";

const CustomMenuComponent = ({ anchorElSettings, handleClose, contianer }) => {
  const player = useSelector((state) => state.commonReducer.player);

  const [anchorElPlayback, setAnchorElPlayback] = useState(null);

  const settingsMenu = [
    {
      label: "Playback Speed",
      onClick: (event) => setAnchorElPlayback(event.currentTarget),
    },
  ];

  return (
    <>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElSettings}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorElSettings)}
        onClose={handleClose}
        container={contianer}
      >
        {settingsMenu.map((item, index) => (
          <MenuItem key={index} onMouseOver={(event) => item.onClick(event)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>{item.label}</span>
              <NavigateNextIcon />
            </div>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id="menu-appbar"
        anchorEl={anchorElPlayback}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElPlayback)}
        onClose={() => setAnchorElPlayback(null)}
        container={contianer}
      >
        {playbackSpeed.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              player.playbackRate = item.speed;
              setAnchorElPlayback(null);
              handleClose();
            }}
          >
            <CheckIcon
              style={{
                visibility: player?.playbackRate === item.speed ? "" : "hidden",
              }}
            />
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ marginLeft: "10px" }}
            >
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CustomMenuComponent;
