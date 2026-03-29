import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import React, {  useEffect, useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useSelector } from "react-redux";
const PreviewDialog = ({
  openPreviewDialog,
  handleClose,
  subtitles,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const annotationData = useSelector((state) => state.getAnnotationsTask.data);

  const [loading, setLoading] = useState(false);

  const dialogRef = useRef(null);


  const handleFullscreenToggle = () => {
    const elem = dialogRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const type1 = annotationData.filter((item) => item.annotation_type == 1);
  const type2 = annotationData.filter((item) => item.annotation_type == 2);
  const type3 = annotationData.filter((item) => item.annotation_type == 3);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <Dialog
      open={openPreviewDialog}
      onClose={handleClose}
      ref={dialogRef}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: "10px",
          width: isFullscreen ? "100%" : "auto",
          height: isFullscreen ? "100%" : "auto",
          margin: 0,
          maxWidth: isFullscreen ? "100%" : "655px",
          overflow: "auto",
        },
      }}
      fullScreen={isFullscreen}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4" flexGrow={1}>
          Subtitles
        </Typography>{" "}
        <IconButton
          aria-label="fullscreen"
          onClick={handleFullscreenToggle}
          sx={{ marginLeft: "auto" }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ height: "410px", zIndex: "4", padding: "3" }}>
        {loading ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <div>
            <table style={{ width: "100%", borderCollapse: "separate" }}>
              <thead>
                <tr>
                  {type1.length > 0 ? (
                    <th style={{ textAlign: "left" }}>
                      <Typography variant="h6">Annotation</Typography>
                    </th>
                  ) : null}
                  {type2.length > 0 ? (
                    <th style={{ textAlign: "left" }}>
                      <Typography variant="h6">Review</Typography>
                    </th>
                  ) : null}
                  {type3.length > 0 ? (
                    <th style={{ textAlign: "left" }}>
                      <Typography variant="h6">SuperCheck</Typography>
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Annotation */}
                  <td style={{ verticalAlign: "top" }}>
                    {type1.length > 0
                      ? type1[0].result.map((el, index) => (
                          <Box
                            key={index}
                            textAlign="start"
                            sx={{
                              mb: 2,
                              padding: 1,
                              border: "1px solid #000000",
                              borderRadius: 2,
                              width: isFullscreen ? "100%" : "100%",
                              height: "auto",
                              cursor: "pointer",
                              boxSizing: "border-box",
                            }}
                          >
                            {el.text}
                          </Box>
                        ))
                      : null}
                  </td>

                  {/* Review */}
                  <td style={{ verticalAlign: "top" }}>
                    {type2.length > 0
                      ? type2[0].result.map((el, index) => (
                          <Box
                            key={index}
                            textAlign="start"
                            sx={{
                              mb: 2,
                              padding: 1,
                              border: "1px solid #000000",
                              borderRadius: 2,
                              width: isFullscreen ? "100%" : "100%",
                              height: "auto",
                              cursor: "pointer",
                              boxSizing: "border-box",
                            }}
                          >
                            {el.text}
                          </Box>
                        ))
                      : null}
                  </td>

                  {/* SuperCheck */}
                  <td style={{ verticalAlign: "top" }}>
                    {type3.length > 0
                      ? type3[0].result.map((el, index) => (
                          <Box
                            key={index}
                            textAlign="start"
                            sx={{
                              mb: 2,
                              padding: 1,
                              border: "1px solid #000000",
                              borderRadius: 2,
                              width: isFullscreen ? "100%" : "100%",
                              height: "auto",
                              cursor: "pointer",
                              boxSizing: "border-box",
                            }}
                          >
                            {el.text}
                          </Box>
                        ))
                      : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default PreviewDialog;
