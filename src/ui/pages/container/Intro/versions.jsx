import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const releases = [
  {
    month: "February 2024",
    version: "v2.9",
    details: [
      "Bug fix for video upload",
      "Permission changes for Admin role",
      "Email based reports automation",
    ],
    align: "left",
  },
  {
    month: "March 2024",
    version: "v3.0",
    details: [
      "Bulk download of voiceover tasks",
      "Onboarding functionality of new clients",
      "Newsletter",
    ],
    align: "right",
  },
];

const Timeline = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 4, px: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 5, color: "#222" , fontSize: "45px",}}
      >
        Release Timeline
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Vertical Line */}
        <Box
          sx={{
            position: "absolute",
            width: "2px",
            backgroundColor: "#D3D3D3",
            height: "100%",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {releases.map((release, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: release.align === "left" ? "flex-start" : "flex-end",
              width: "100%",
              maxWidth: "1000px",
              mb: 4,
              position: "relative",
            }}
          >
            {/* Card Box */}
            <Card
              sx={{
                width: "40%",
                backgroundColor: "#EAF4FE",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                textAlign: "left",
                p: 2,
              }}
            >
              <CardContent>
                <Typography sx={{ color: "#0074D9", fontWeight: "bold" }}>
                  {release.month}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {release.version}
                </Typography>
                <ul style={{ paddingLeft: "15px" }}>
                  {release.details.map((detail, i) => (
                    <li key={i} style={{ fontSize: "14px", color: "#333" }}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Timeline Dot */}
            <Box
              sx={{
                width: "10px",
                height: "10px",
                backgroundColor: "#4A4A4A",
                borderRadius: "50%",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Timeline;
