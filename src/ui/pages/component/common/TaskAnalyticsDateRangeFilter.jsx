import React, { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import { format, subMonths } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const getDefaultRange = () => ({
  startDate: subMonths(new Date(), 1),
  endDate: new Date(),
  key: "selection",
});

const TaskAnalyticsDateRangeFilter = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const displayedRange = value || getDefaultRange();
  const label = value
    ? `${format(value.startDate, "dd MMM yyyy")} - ${format(
        value.endDate,
        "dd MMM yyyy"
      )}`
    : "All time";

  const handleRangeChange = ({ selection }) => {
    const endDate = selection.endDate > new Date() ? new Date() : selection.endDate;
    onChange({ ...selection, endDate, key: "selection" });
  };

  const handleClear = () => {
    onChange(null);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Typography variant="body2" mb={0.5}>
        Date Range
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label="Select task analytics date range"
        sx={{ textTransform: "none" }}
      >
        {label}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <DateRange
          editableDateInputs
          moveRangeOnFirstSelection={false}
          onChange={handleRangeChange}
          ranges={[displayedRange]}
          maxDate={new Date()}
        />
        <Box display="flex" justifyContent="flex-end" gap={1} p={1}>
          <Button onClick={handleClear} disabled={!value}>
            Clear
          </Button>
          <Button variant="contained" onClick={() => setAnchorEl(null)}>
            Done
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default TaskAnalyticsDateRangeFilter;
