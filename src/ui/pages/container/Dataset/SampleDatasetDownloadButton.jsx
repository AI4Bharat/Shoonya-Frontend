import { useState } from "react";
import { useDispatch } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetSampleDatasetDownload from "../../../../redux/actions/api/Dataset/GetSampleDatasetDownload";

const sampleFormatOptions = [
  { name: "CSV", value: "csv" },
  { name: "TSV", value: "tsv" },
  { name: "JSON", value: "json" },
];

export default function SampleDatasetDownloadButton({ datasetId }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (event, exportType) => {
    event.stopPropagation();
    dispatch(APITransport(new GetSampleDatasetDownload(datasetId, exportType)));
    handleClose();
  };

  return (
    <>
      <Tooltip title="Download Sample Dataset">
        <InfoIcon
          sx={{ cursor: "pointer", marginLeft: "0.5rem" }}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen(e);
          }}
        />
      </Tooltip>

      <Menu
        id="sample-download-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {sampleFormatOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={(e) => handleSelect(e, option.value)}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
