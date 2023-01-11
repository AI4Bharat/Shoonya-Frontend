import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//Themes
import {
  Box,
  Grid,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
  IconButton,
  DialogContentText,
  Button,
  Popover,
  Typography,
  Divider,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import MUIDataTable from "mui-datatables";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GlossarysentenceAPI from "../../../../redux/actions/api/Glossary/GlossarySentence";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CustomizedSnackbars from "../../component/common/Snackbar";
import LanguageCode from "../../../../utils/LanguageCode";
import Search from "../../component/common/Search";
import { useParams } from "react-router-dom";
import ThumbsUpDownOutlinedIcon from "@mui/icons-material/ThumbsUpDownOutlined";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddGlossary from "./AddGlossary";
import { translate } from "../../../../config/localisation";

export default function Glossary(props) {
  const { taskData } = props;
  const dispatch = useDispatch();
  const Glossarysentence = useSelector((state) => state.glossarysentence.data);
  const SearchWorkspaceMembers = useSelector(
    (state) => state.SearchProjectCards.data
  );
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [targetlang, settargetlang] = useState("");
  const [Sourcelang, setSourcelang] = useState("");
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const language = LanguageCode.languages;

  useEffect(() => {
    if (taskData && taskData.data) {
      const filtereddata = language.filter(
        (el) =>
          el.label===
          taskData.data?.input_language
         
      );
      setSourcelang(filtereddata[0]?.code)
    }
    if (taskData && taskData.data) {
      const filtereddata = language.filter(
        (el) =>
          el.label ===
          taskData.data?.output_language
      );
      settargetlang(filtereddata[0]?.code)
      const Glossarysentencedata = {
        inputs: [taskData.data?.input_text],
        tgtLanguage: filtereddata[0]?.code,
      };
      const GlossaryObj = new GlossarysentenceAPI(Glossarysentencedata);
      dispatch(APITransport(GlossaryObj));
    }
  }, [taskData]);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setShowSnackBar({
      message: "Copied to clipboard!",
      variant: "success",
      timeout: 1500,
      visible: true,
    });
  };
  const handleSnackBarClose = () => {
    setShowSnackBar({
      message: "",
      variant: "",
      timeout: 1500,
      visible: false,
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClickOpen = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const columns = [
    {
      name: "srcText",
      label: "Source",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
      name: "tgtText",
      label: "Target ",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
      name: "domain",
      label: "Domain",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
      name: "collectionSource",
      label: "Collection Source",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },

    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
  ];

  const pageSearch = () => {
    return Glossarysentence[0]?.glossaryPhrases.filter((el) => {
      if (SearchWorkspaceMembers == "") {
        return el;
      } else if (
        el.srcText
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
        return el;
      } else if (
        el.tgtText
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
        return el;
      } else if (
        el.collectionSource
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const data =
    Glossarysentence[0]?.glossaryPhrases &&
    Glossarysentence[0]?.glossaryPhrases.length > 0
      ? pageSearch().map((el, i) => {
          return [
            el.srcText,
            el.tgtText,
            el.domain,
            el.collectionSource,
            <>
              <Button onClick={() => handleCopyText(el.tgtText)}>
                <Tooltip title="Copy">
                  <ContentCopyIcon fontSize="small" />
                </Tooltip>
              </Button>
              <Button aria-describedby={id} onClick={handleClick}>
                <Tooltip title="Rate this translation">
                  <ThumbsUpDownOutlinedIcon fontSize="medium" />
                </Tooltip>
              </Button>
            </>,
          ];
        })
      : [];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    // customToolbar: fetchHeaderButton,
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    // rowsPerPage: PageInfo.count,
    filter: false,
    // page: PageInfo.page,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };
  return (
    <>
      <CustomizedSnackbars
        hide={showSnackBar.timeout}
        open={showSnackBar.visible}
        handleClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={showSnackBar.variant}
        message={showSnackBar.message}
      />
      <div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Grid sx={{ p: "20px" }}>
            <Typography variant="h6" align="center">
              {" "}
              {translate("label.Rate this translation")}
            </Typography>
            <Grid sx={{ padding: "10px 0px 30px 37px" }}>
              <Button sx={{ border: "1px solid gray", borderRadius: "25px" }}>
                <Tooltip title="Good translation">
                  <ThumbUpOffAltOutlinedIcon fontSize="medium" />
                </Tooltip>
              </Button>

              <Button
                sx={{ border: "1px solid gray", borderRadius: "25px", ml: 1 }}
              >
                <Tooltip title="Poor translation">
                  <ThumbDownOffAltOutlinedIcon
                    fontSize="medium"
                    color="inherit"
                  />
                </Tooltip>
              </Button>
            </Grid>
            <Typography variant="body2" align="center" sx={{ width: "215px" }}>
              {translate("button.Your feedback")}
            </Typography>
            <Divider sx={{ padding: "15px 0px 0px 0px" }} />
            <Button sx={{ ml: 2, mt: 1 }} onClick={handleClickOpen}>
              <EditOutlinedIcon fontSize="medium" />
              <Typography variant="subtitle2">
                {translate("button.Suggest an edit")}
              </Typography>
            </Button>
          </Grid>
        </Popover>
      </div>
      <Grid sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{ width: "150px", textDecoration: "none" }}
          onClick={handleClickOpen}
        >
          {" "}
          Add Glossary
        </Button>

        <Search style={{ margin: "0px" }} />
      </Grid>
      {openDialog && (
        <AddGlossary
          openDialog={openDialog}
          handleCloseDialog={() => handleCloseDialog()}
          targetlang={targetlang}
          Sourcelang={Sourcelang}
        />
      )}

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={data} columns={columns} options={options} />
      </ThemeProvider>
    </>
  );
}
