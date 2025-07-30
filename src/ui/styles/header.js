import { makeStyles } from "@mui/styles";

const headerStyle = makeStyles({
  parentContainer: {
    marginBottom: window.innerHeight * 0.13,
    width: window.innerWidth * 0.98,
  },
  AudioparentContainers: {
    marginBottom: window.innerHeight * 0.1,
    width: window.innerWidth * 0.98,
  },
  appBar: {},
  toolbar: {
    width: "80%",
    height: "64px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between !important",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    zIndex: 200,
    "@media (min-width: 900px) and (max-width: 1400px)": {
      width: "100%",
    },
  },
  menu: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  headerLogo: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
  },
  headerTitle: {
    color: "#373939",
    display: "inline-block",
    letterSpacing: "1px",
    fontDisplay:"swap",
    fontSize: "28px",
    fontWeight: "bold",
    fontFamily: 'Rowdies,"cursive", Roboto, sans-serif',
    "@media (min-width: 900px) and (max-width: 1400px)": {
      fontSize: "24px !important",
    },
  },
  headerMenu: {
    textDecoration: "none",
    backgroundColor: "transparent",
    padding: "18px ",
    color: "black",
    boxShadow: "none",
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    letterSpacing: "0.5px",
    borderRadius: 12,
    "&:hover": {
      backgroundColor: "#E0E0E0",
      boxShadow: "none",
    },
    "@media (min-width: 900px) and (max-width: 1400px)": {
      fontSize: "14px !important",
      padding: "12px !important",
    },
  },
  highlightedMenu: {
    backgroundColor: "#E0E0E0",
    textDecoration: "none",
    borderRadius: "inherit",
    padding: "18px ",
    color: "black",
    boxShadow: "none",
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    borderRadius: 12,
    letterSpacing: "0.5px",
    "&:hover": {
      backgroundColor: "#E0E0E0",
      boxShadow: "none",
    },
    "@media (min-width: 900px) and (max-width: 1400px)": {
      fontSize: "14px !important",
      padding: "12px !important",
    },
  },
  avatar: {
    width: "36px",
    height: "36px",
    backgroundColor: "#2A61AD !important",
    fontSize: "14px",
    color: "#FFFFFF !important",
    "@media (max-width:640px)": {
      width: "26px",
      height: "26px",
    },
  },
  nav_notif_container: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    marginRight: "10px",
    cursor: "pointer"
  },
  drawer: {
    width: "50%",
    flexShrink: 0,
  },
  listItem: {
    cursor: "pointer",
    padding: "12px 32px",
    borderRadius: "8px",
    margin: "4px 16px",
    transition: "all 0.2s ease",
    fontSize: "1rem !important",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transform: "translateX(5px)",
    },
  },
  profileBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px",
  },
  mobileNav_avatar: {
    backgroundColor: "#2A61AD !important",
    width: 45,
    height: 45,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  drawerPaper: {
    width: "50%",
    padding: "0",
    transition: "all 0.3s ease-in-out",
    overflowX: "hidden",
  },
  sectionTitle: {
    fontSize: "1rem !important",
    fontWeight: 600,
    paddingX: "32px",
    marginX: "16px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "rgba(0, 0, 0, 0.6)",
    padding: "16px 16px 8px 16px",
  },
  logoutItem: {
    cursor: "pointer",
    padding: "12px 32px",
    borderRadius: "8px",
    fontSize: "16px !important",
    margin: "4px 16px",
    color: "#f44336",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(244, 67, 54, 0.1)",
      transform: "translateX(5px)",
    },
  },
  mobileNav_appBar: {
    backgroundColor: "#ffffff !important",
    padding: "8px 0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  mobileNav_headerLogo: {
    height: "40px",
    marginRight: "10px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  mobileNav_headerTitle: {
    fontSize: "28px",
    fontWeight: "500",
    fontFamily: "Rowdies,cursive,Roboto,sans-serif",
    color: "#2e5cb8",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#1a3a7a",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuButton: {
    color: "#2C2799",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "rotate(90deg)",
      color: "#303F9A",
    },
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 100,
    color: "rgba(0, 0, 0, 0.6)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "rotate(90deg) !important",
      color: "#303F9A !important",
    },
  },
  modalContent: {
    backgroundColor: "#fff",
    boxShadow:
      "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    padding: "32px",
    outline: "none",
    borderRadius: "8px",
    width: "80%",
  },
  tabContent: {
    padding: "16px",
  },
  username: {
    color: "#000",
    fontWeight: 500,
    fontSize: "1.4rem !important",
  }
});

export default headerStyle;
