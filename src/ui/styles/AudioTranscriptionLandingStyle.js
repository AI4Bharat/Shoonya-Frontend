import { makeStyles } from "@mui/styles";

const AudioTranscriptionLandingStyle = makeStyles({
  parentGrid: {
    // marginTop: "55px",
    overflow: "hidden",
  },

  videoParent: {
    width: "100%",
    overflow: "hidden",
  },

  videoBox: {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },

  videoNameBox: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "rgba(254, 191, 44, 0.1)",
    backgroundColor: "#fcf7e9",
    padding:"16px"
  },

  videoName: {
    textAlign: "center",
    margin: "32px",
    width: "90%",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },

  settingsIconBtn: {
    backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    margin: "auto",
    "&:hover": {
      backgroundColor: "#271e4f",
    },
  },

  subtitlePanel: {
    position: "absolute",
    zIndex: "20",
    left: "0",
    right: "0",
    bottom: "7%",
    width: "94%",
    padding: "0 22px",
    userSelect: "none",
    pointerEvents: "none",
  },

  operate: {
    padding: "5px 15px",
    color: "#fff",
    fontSize: "13px",
    borderRadius: "3px",
    marginBottom: "5px",
    backgroundColor: "rgb(0 0 0 / 75%)",
    border: "1px solid rgb(255 255 255 / 20%)",
    cursor: "pointer",
    pointerEvents: "all",
  },

  playerTextarea: {
    width: "100%",
    outline: "none",
    resize: "none",
    textAlign: "center",
    lineHeight: "1.2",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    padding: "5px 10px",
    pointerEvents: "all",
  },

  darkMode: {
    backgroundColor: "rgb(256 256 256 / 50%)",
    color: "#000",
    fontWeight: "bolder",
  },

  lightMode: {
    backgroundColor: "rgb(0 0 0 / 50%)",
    color: "#fff",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
  },

  fullscreenVideoBtn: {
    position: "absolute",
    bottom: "1%",
    right: "3%",
    zIndex: "999",
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "rgb(0 0 0 / 50%)",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
  },

  fullscreenBtn: {
    position: "absolute",
    bottom: "25px",
    right: "25px",
    zIndex: "999",
    borderRadius: "4px",
    backgroundColor: "#0083e2",
    minWidth: "45px",
    padding: 0,
  },

  backDrop: {
    color: "#fff",
    zIndex: 999999,
    display: "flex",
    flexDirection: "column",
    "&.MuiBackdrop-root": {
      backgroundColor: "#1d1d1d",
    },
  },

  timeLineParent: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "150px",
    width: "100%",
  },

  waveform: {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    zIndex: "1",
    width: "100%",
    height: "100%",
    userSelect: "none",
    pointerEvents: "none",
  },

  progress: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "-18px",
    zIndex: 11,
    width: "100%",
    height: "18px",
    userSelect: "none",
    // borderTop: "1px solid rgb(255 255 255 / 20%)",
    backgroundColor: "rgb(0 0 0 / 10%)",
  },

  bar: {
    position: "absolute",
    left: "0",
    top: "0",
    bottom: "0",
    width: "0%",
    height: "100%",
    display: "inline-block",
    border: "1.5px solid #ff9800",
    // backgroundColor: "rgb(0 0 255 / 60%)",
    overflow: "hidden",
  },

  handle: {
    position: "absolute",
    right: "0",
    top: "0",
    bottom: "0",
    width: "10px",
    cursor: "ew-resize",
    backgroundColor: "#ff9800",
  },

  timelineSubtitle: {
    position: "absolute",
    left: "10",
    top: "0",
    bottom: "0",
    right: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },

  item: {
    position: "absolute",
    top: "5%",
    bottom: "0",
    height: "90%",
    backgroundColor: "rgb(255 0 0 / 50%)",
    border: "0.5px solid rgb(255 0 0 / 80%)",
  },

  item_completed: {
    position: "absolute",
    top: "5%",
    bottom: "0",
    height: "90%",
    backgroundColor: "rgb(0 255 0 / 50%)",
    border: "0.5px solid rgb(0 255 0 / 80%)",
  },

  grab: {
    position: "relative",
    zIndex: "11",
    cursor: "grab",
    height: "10%",
    userSelect: "none",
    backgroundColor: "rgb(0 0 0 / 20%)",
    borderTop: "0px solid rgb(33 150 243 / 30%)",
    borderBottom: "0px solid rgb(33 150 243 / 30%)",
  },

  grabbing: {
    cursor: "grabbing",
  },

  duration: {
    position: "absolute",
    left: "0",
    right: "0",
    top: "35px",
    zIndex: "12",
    fontSize: "18px",
    color: "rgb(255 255 255 / 75%)",
    textShadow: "0 1px 2px rgb(0 0 0 / 75%)",
    marginLeft: "10px",
    userSelect: "none",
    pointerEvents: "none",
  },

  durationSpan: {
    padding: "5px 10px",
    backgroundColor: "rgb(0 0 0 / 50%)",
  },

  Metronome: {
    position: "absolute",
    zIndex: "8",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    cursor: "ew-resize",
    userSelect: "none",
    borderBottom: "15px solid rgb(0 0 0 / 20%)",
  },

  template: {
    position: "absolute",
    top: "0",
    bottom: "0",
    height: "100%",
    backgroundColor: "rgba(76, 175, 80, 0.5)",
    borderLeft: "1px solid rgba(76, 175, 80, 0.8)",
    borderRight: "1px solid rgba(76, 175, 80, 0.8)",
    userSelect: "none",
    pointerEvents: "none",
  },

  contextMenu: {
    position: "absolute",
    zIndex: "9",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "all",
  },

  parentSubtitleBox: {
    position: "absolute",
    zIndex: "9",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
 

  subItem: {
    position: "absolute",
    top: "10%",
    left: "0",
    height: "80%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    wordWrap: "break-word",
    color: "#000000",
    fontSize: "14px",
    cursor: "move",
    userSelect: "none",
    pointerEvents: "all",
    backgroundColor: "rgba(255, 255, 255, 0)",
    // border: "1px solid rgba(255, 255, 255, 0.2)",

    "&:hover": {
      backgroundColor: " rgba(255, 255, 255, 0)",
      border: "1px solid rgba(255, 191, 0, 1)"
      // top: '8%',
      // height: "98%"
    },
  },

  subHighlight: {
    // backgroundColor: "rgba(156, 39, 176, 0.2)",
    border: "1px solid rgba(255 ,0 , 0)",
  },

  subHandle: {
    position: "absolute",
    top: "0",
    bottom: "0",
    zIndex: "1",
    height: "100%",
    cursor: "col-resize",
    userSelect: "none",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.0)",
    },
  },

  subText: {
    position: "relative",
    zIndex: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    // textShadow:
      // "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
    height: "100%",
    wordWrap: "break-word",
  },

  subTextP: {
    margin: "2px 0",
    lineHeight: "1",
  },

  subDuration: {
    opacity: "0",
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100%",
    textAlign: "center",
    fontSize: "12px",
  },

  menuItem: {
    padding: "5px 15px",
    backgroundColor: "#fff",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "skyblue",
    },
  },

  menuItemNav: {
    borderRadius: "6px",
    zIndex: "20",
  },
  

  optionIconBtn: {
    //backgroundColor: "#fff",
    backgroundColor: "#fcf7e9",
    borderRadius: "50%",
    marginRight: "10px",
    color: "blue",
    "&:disabled": {
      background: "grey",
    },
    "&:hover": {
      // backgroundColor: "#fff",
      backgroundColor: "#fcf7e9",
    },
  },

  rightPanelParentGrid: {
    display: "flex",
    direction: "row",
    flexWrap: "wrap",
    padding: "15.5px 0",
    justifyContent: "center",
    // backgroundColor: "rgba(254, 191, 44, 0.1)",
    backgroundColor: "#fcf7e9",
  },

  rightPanelParentBox: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eaeaea",
  },

  rightPanelBtnGrp: {
    backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    marginX: "5px",
    "&:hover": {
      backgroundColor: "#271e4f",
    },
  },

  rightPanelDivider: {
    border: "1px solid grey",
    height: "auto",
    margin: "0 5px",
  },

  subTitleContainer: {
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid #eaeaea",
    overflowY: "scroll",
    overflowX: "hidden",
    // backgroundColor: "black",
    width: "100%",
    textAlign: "center",
    boxSizing: "border-box",
    height: "calc(100vh - 370px)",
  },

  topBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    padding: "16px 0px",
    alignItems: "center",
  },

  relative: {
    position: "relative",
  },

  customTextarea: {
    padding: "12px 12px",
    fontSize: "1.25rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    color: "rgba(0, 0, 0, 0.87)",
    borderRadius: "4px",
    borderColor: "rgba(0, 0, 0, 0.23)",
    outlineColor: "#2C2799",
    resize: "none",
    fontFamily: "Roboto, sans-serif",
    width: "100%",
  },

  boxHighlight: {
    backgroundColor: "rgb(0 87 158)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "#fff !important",
  },

  wordCount: {
    background: "white",
    color: "green",
    fontWeight: 700,
    height: "20px",
    width: "30px",
    borderRadius: "50%",
    position: "absolute",
    bottom: "-25px",
    right: "10px",
    textAlign: "center",
  },

  topBoxTranslation: {
    display: "flex",
    paddingTop: "16px",
    paddingX: "20px",
    justifyContent: "space-around",
  },

  textAreaTransliteration: {
    width: "85%",
    padding: "16.5px 12px",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    color: "rgba(0, 0, 0, 0.87)",
    borderRadius: "4px",
    borderColor: "#616A6B",
    outlineColor: "#2C2799",
    resize: "none",
    fontFamily: "Roboto, sans-serif",
  },

  videoPlayerParent: {
    boxSizing: "border-box",
    height: "calc(60vh - 366px)",
    // paddingTop:"9%"
  },

  videoPlayer: {
    cursor: "pointer",
    width: "100%",
    objectFit: "fill",
    // maxHeight: "100%",
  },

  recorder: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    height: "100%",
  },

  paginationBox: {
    position: "absolute",
    // bottom: "-62px",
    background: "#fff",
    width: "50%",
    color: "#fff",
    textAlign: "center",
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #EAEAEA",
  },

  durationBox: {
    backgroundColor: "#616A6B",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
  },

  audioBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    height: "100%",
    justifyContent: "space-evenly",
  },

  playbackRate: {
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "#0083e2",
    display: "flex",
    alignItems: "center",
    marginRight: "10%",
  },

  disabledCard: {
    opacity: "0.5",
    cursor: "not-allowed",
  },

  suggestionListTypography: {
    borderBottom: "1px solid lightgrey",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#000",
    padding: "16px",
    "&:hover": {
      color: "white",
      backgroundColor: "#1890ff",
    },
  },

  suggestionListHeader: {
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid lightgrey",
  },
  collapse :{
    margin: "1%",
    overflow: "hidden",
    transition: "height 0.2s ease-in-out",
},
  timeInputBox: {
    backgroundColor: "#616A6B",
    width: "15%",
    "& .MuiInputBase-input": {
      textAlign: "center",
      color: "#fff",
      fontSize: "1rem",
      padding: "5px 0",
    },
    "& .MuiInput-root:after": {
      border: "none",
    },
    "& .MuiInput-root:hover:before": {
      border: "none",
    },
    "& .MuiInput-root:before": {
      border: "none",
    },
    "& .MuiInput-input": {
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
      },
    },
  },
});

export default AudioTranscriptionLandingStyle;
