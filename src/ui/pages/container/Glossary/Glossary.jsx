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
import UpVoteAndDownVoteAPI from "../../../../redux/actions/api/Glossary/UpVoteAndDownVote";
import SuggestAnEdit from "./SuggestAnEdit";
import SuggestAnEditAPI from "../../../../redux/actions/api/Glossary/SuggestAnEdit";

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
  const [SuggestAnEditDialog, setSuggestAnEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [targetlang, settargetlang] = useState("");
  const [Sourcelang, setSourcelang] = useState("");
  const [hashCode, setHashCode] = useState("");
  const[tgtText,setTgtText] = useState("");
  const[srcText,setSrcText] = useState("");
  const[domain,setDomain] = useState("");
  const[level,setLevel] = useState("");
  const[collectionSource,setCollectionSource] = useState("");
  const [sourceText, setSourceText] = useState();
  const [targetText, settargetText] = useState();
  const[domainValue,setDomainValue] = useState()
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const language = LanguageCode.languages;

  useEffect(() => {
    if (taskData && taskData.data) {
      const filtereddata = language.filter(
        (el) => el.label === taskData.data?.input_language
      );
      setSourcelang(filtereddata[0]?.code);
    }
    if (taskData && taskData.data) {
      const filtereddata = language.filter(
        (el) => el.label === taskData.data?.output_language
      );
      settargetlang(filtereddata[0]?.code);
      const Glossarysentencedata = {
        inputs: [taskData.data?.input_text],
        tgtLanguage: filtereddata[0]?.code,
      };
      const GlossaryObj = new GlossarysentenceAPI(Glossarysentencedata);
      dispatch(APITransport(GlossaryObj));
    }
  }, [taskData]);



  useEffect(() => {
    setSourceText(srcText)
    settargetText(tgtText)
    setDomainValue(domain)
  }, [srcText,tgtText,domain])

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

  const handleClickThumbsUpDown = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSuggestAnEditDialog(false);
  };
  const handleClickOpen = () => {
    setOpenDialog(true);
    
  };

  const handleClickOpenSuggestAnEdit = () => {
    setSuggestAnEditDialog(true);
    setAnchorEl(null);
  };

  const handleThumbsUpDown = (hashcode,srcText,tgtText,domain,collectionSource,level) => {
    setHashCode(hashcode);
    setSrcText(srcText);
    setTgtText(tgtText);
    setDomain(domain);
    setCollectionSource(collectionSource);
    setLevel(level)
  };

  const OnClickUpVote = async () => {
    const UpVotedata = {
      item_id: hashCode,
      action: 1,
    };
    console.log(UpVotedata, "UpVotedata");
    const GlossaryObj = new UpVoteAndDownVoteAPI(UpVotedata);
    //dispatch(APITransport(GlossaryObj));
    const res = await fetch(GlossaryObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(GlossaryObj.getBody()),
      headers: GlossaryObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    setAnchorEl(null);
  };

  const OnClickDownVote = async () => {
    const DownVotedata = {
      item_id: hashCode,
      action: -1,
    };
    
    const GlossaryObj = new UpVoteAndDownVoteAPI(DownVotedata);
    //dispatch(APITransport(GlossaryObj));
    const res = await fetch(GlossaryObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(GlossaryObj.getBody()),
      headers: GlossaryObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    setAnchorEl(null);
  };


  const submitSuggestAnEditHandler = async() =>{
    const SuggestAnEditData = {
      new: {
        glossary: [
          {
            srcLanguage: Sourcelang,
            tgtLanguage: targetlang,
            srcText: sourceText,
            tgtText: targetText,
            domain: domain,
            collectionSource: collectionSource,
            level: level,
          },
        ],
      },
      hash: hashCode,
    };
    const GlossaryObj = new SuggestAnEditAPI(SuggestAnEditData);
    //dispatch(APITransport(GlossaryObj));
    const res = await fetch(GlossaryObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(GlossaryObj.getBody()),
      headers: GlossaryObj.getHeaders().headers,
    });
    const resp = await res.json();
    //setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    setSuggestAnEditDialog(false);
  }


  

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
              <span onClick={() => handleThumbsUpDown(el.hash,el.srcText,el.tgtText,el.domain,el.collectionSource,el.level)}>
                <Button aria-describedby={id} onClick={handleClickThumbsUpDown}>
                  <Tooltip title="Rate this translation">
                    <ThumbsUpDownOutlinedIcon fontSize="medium" />
                  </Tooltip>
                </Button>
              </span>
            </>,
            el.hash,
            el.level,
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
    viewColumns: true,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <>
      {renderSnackBar()}
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
              <Button
                onClick={OnClickUpVote}
                sx={{ border: "1px solid gray", borderRadius: "25px" }}
              >
                <Tooltip title="Good translation">
                  <ThumbUpOffAltOutlinedIcon fontSize="medium" />
                </Tooltip>
              </Button>

              <Button
                onClick={OnClickDownVote}
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
            <Button sx={{ ml: 2, mt: 1 }} onClick={handleClickOpenSuggestAnEdit}>
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
         // addBtnClickHandler={AddGlossaryHandler}
          targetlang={targetlang}
          Sourcelang={Sourcelang}
        />
      )}

      {SuggestAnEditDialog && (
      <SuggestAnEdit 
          openDialog={SuggestAnEditDialog}
          handleCloseDialog={() => handleCloseDialog()}
          addBtnClickHandler={submitSuggestAnEditHandler}
          sourceText={sourceText}
          targetText={targetText}
         settargetText={settargetText}
         domainValue={domainValue}
         setDomainValue={setDomainValue}
          data={taskData.data}
      />
      )}

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={data} columns={columns} options={options} />
      </ThemeProvider>
    </>
  );
}
