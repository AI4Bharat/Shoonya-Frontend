import React, { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";

//Themes
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../../theme/tableTheme";
import MUIDataTable from "mui-datatables";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GlossarysentenceAPI from "../../../../redux/actions/api/Glossary/GlossarySentence";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CustomizedSnackbars from "../../component/common/Snackbar";
import LanguageCode from "../../../../utils/LanguageCode";
import Search from "../../component/common/Search";
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
  const [tgtText, setTgtText] = useState("");
  const [srcText, setSrcText] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const [collectionSource, setCollectionSource] = useState("");
  const [sourceText, setSourceText] = useState();
  const [targetText, settargetText] = useState();
  const [domainValue, setDomainValue] = useState();
  const [glossaryData, setGlossarydata] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const language = LanguageCode.languages;

  useEffect(() => {
    searchGlossary();
  }, [taskData]);

  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);

    // Force responsive mode after component mount
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector(
          ".MuiDataTable-responsiveBase"
        );
        if (tableWrapper) {
          tableWrapper.classList.add("MuiDataTable-vertical");
        }
      }
    };

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  const searchGlossary = () => {
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
  };

  useEffect(() => {
    setSourceText(srcText);
    settargetText(tgtText);
    setDomainValue(domain);
  }, [srcText, tgtText, domain]);

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

  const handleThumbsUpDown = (
    hashcode,
    srcText,
    tgtText,
    domain,
    collectionSource,
    level
  ) => {
    setHashCode(hashcode);
    setSrcText(srcText);
    setTgtText(tgtText);
    setDomain(domain);
    setCollectionSource(collectionSource);
    setLevel(level);
  };

  const OnClickUpVote = async () => {
    const UpVotedata = {
      item_id: hashCode,
      action: 1,
    };
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

  const submitSuggestAnEditHandler = async () => {
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
      searchGlossary();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    setSuggestAnEditDialog(false);
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
            height: "35px",
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

  useEffect(() => {
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
                <span
                  onClick={() =>
                    handleThumbsUpDown(
                      el.hash,
                      el.srcText,
                      el.tgtText,
                      el.domain,
                      el.collectionSource,
                      el.level
                    )
                  }
                >
                  <Button
                    aria-describedby={id}
                    onClick={handleClickThumbsUpDown}
                  >
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
    setGlossarydata(data);
  }, [Glossarysentence, SearchWorkspaceMembers]);

  const CustomFooter = ({
    count,
    page,
    rowsPerPage,
    changeRowsPerPage,
    changePage,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px",
          },
        }}
      >
        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => changePage(newPage)}
          onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
          sx={{
            "& .MuiTablePagination-actions": {
              marginLeft: "0px",
            },
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input":
              {
                marginRight: "10px",
              },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label
            style={{
              marginRight: "5px",
              fontSize: "0.83rem",
            }}
          >
            Jump to Page:
          </label>
          <Select
            value={page + 1}
            onChange={(e) => changePage(Number(e.target.value) - 1)}
            sx={{
              fontSize: "0.8rem",
              padding: "4px",
              height: "32px",
            }}
          >
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Box>
    );
  };

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
    responsive: "vertical",
    enableNestedDataAccess: ".",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
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
            <Button
              sx={{ ml: 2, mt: 1 }}
              onClick={handleClickOpenSuggestAnEdit}
            >
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
          targetlang={targetlang}
        />
      )}

      <ThemeProvider theme={tableTheme}>
        <div ref={tableRef}>
          {isBrowser ? (
            <MUIDataTable
              key={`table-${displayWidth}`}
              title={""}
              data={glossaryData}
              columns={columns}
              options={options}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{
                mx: 2,
                my: 3,
                borderRadius: "4px",
                transform: "none",
              }}
            />
          )}
        </div>
      </ThemeProvider>
    </>
  );
}
