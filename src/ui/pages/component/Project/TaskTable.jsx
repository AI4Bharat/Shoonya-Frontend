// TaskTable

import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams, useNavigate,useLocation } from "react-router-dom";
import GetTasksByProjectIdAPI from "../../../../redux/actions/api/Tasks/GetTasksByProjectId";
import CustomButton from "../common/Button";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  ThemeProvider,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import DatasetStyle from "../../../styles/Dataset";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterList from "./FilterList";
import PullNewBatchAPI from "../../../../redux/actions/api/Tasks/PullNewBatch";
import PullNewReviewBatchAPI from "../../../../redux/actions/api/Tasks/PullNewReviewBatch";
import GetNextTaskAPI from "../../../../redux/actions/api/Tasks/GetNextTask";
import DeallocateTasksAPI from "../../../../redux/actions/api/Tasks/DeallocateTasks";
import DeallocateReviewTasksAPI from "../../../../redux/actions/api/Tasks/DeallocateReviewTasks";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import SetTaskFilter from "../../../../redux/actions/Tasks/SetTaskFilter";
import CustomizedSnackbars from "../../component/common/Snackbar";
import SearchIcon from "@mui/icons-material/Search";
import SearchPopup from "./SearchPopup";
import { snakeToTitleCase } from "../../../../utils/utils";
import ColumnList from "../common/ColumnList";
import Spinner from "../../component/common/Spinner";
import OutlinedTextField from "../common/OutlinedTextField";
import FindAndReplaceDialog from "../../component/common/FindAndReplaceDialog"
import FindAndReplaceWordsInAnnotationAPI from "../../../../redux/actions/api/ProjectDetails/FindAndReplaceWordsinAnnotation";
import roles from "../../../../utils/UserMappedByRole/Roles";
import TextField from '@mui/material/TextField';
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";


const excludeSearch = ["status", "actions", "output_text"];
// const excludeCols = ["context", "input_language", "output_language", "language",
// "conversation_json", "source_conversation_json", "machine_translated_conversation_json", "speakers_json"
//  ];
const excludeCols = [
  "context",
  "input_language",
  "output_language",
  "conversation_json",
  "source_conversation_json",
  "machine_translated_conversation_json",
  "speakers_json",
  "language",
  "audio_url",
  "speaker_0_details",
  "speaker_1_details",
  "machine_transcribed_json",
  "unverified_conversation_json",
  "prediction_json",
  "ocr_prediction_json",
];

const TaskTable = (props) => {
  const classes = DatasetStyle();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  const taskList = useSelector(
    (state) => state.getTasksByProjectId.data.result
  );
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rejected,setRejected] = useState(false)
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [OpenFindAndReplaceDialog, setOpenFindAndReplaceDialog] = useState(false);

  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const getProjectUsers = useSelector(
    (state) => state.getProjectDetails.data.annotators
  );

  const getProjectReviewers = useSelector(
    (state) => state.getProjectDetails.data.annotation_reviewers
  );
  const TaskFilter = useSelector((state) => state.setTaskFilter.data);
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);

  console.log(ProjectDetails.project_stage == 2 ,ProjectDetails?.annotation_reviewers?.some((reviewer) => reviewer.id === userDetails?.id),"hhhhhhhhh")
  const filterData = {
    Status: ((ProjectDetails.project_stage == 2||ProjectDetails.project_stage == 3) || ProjectDetails?.annotation_reviewers?.some((reviewer) => reviewer.id === userDetails?.id))

      ? props.type === "annotation"
        ? ["unlabeled", "skipped", "draft", "labeled", "to_be_revised"]
        : [
          "unreviewed",
          "accepted",
          "accepted_with_minor_changes",
          "accepted_with_major_changes",
          "to_be_revised",
          "draft",
          "skipped",
          "rejected",
        ]
      : ["unlabeled", "skipped", "labeled", "draft"],
    Annotators:
      ProjectDetails?.annotators?.length > 0
        ? ProjectDetails?.annotators?.map((el, i) => {
          return {
            label: el.username,
            value: el.id,
          };
        })
        : [],

    Reviewers:
      ProjectDetails?.annotation_reviewers?.length > 0
        ? ProjectDetails?.annotation_reviewers.map((el, i) => {
          return {
            label: el.username,
            value: el.id,
          };
        })
        : [],
  };
  const [pull, setpull] = useState("All");
  const pullvalue = (pull == 'Pulled By reviewer' || pull == 'Pulled By SuperChecker') ? false :
    (pull == 'Not Pulled By reviewer' || pull == 'Not Pulled By SuperChecker') ? true :
      ''
  const [selectedFilters, setsSelectedFilters] = useState(
    props.type === "annotation"
      ? TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
        ? TaskFilter.filters
        : { annotation_status: filterData.Status[0] , req_user: -1 }
      : TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
        ? TaskFilter.filters
        : { review_status: filterData.Status[0], req_user: -1 }
  );
  const NextTask = useSelector((state) => state?.getNextTask?.data);
  const [tasks, setTasks] = useState([]);
  const [pullSize, setPullSize] = useState(
    ProjectDetails.tasks_pull_count_per_batch * 0.5
  );
  const [pullDisabled, setPullDisabled] = useState("");
  const [deallocateDisabled, setDeallocateDisabled] = useState("");
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [deallocateDialog, setDeallocateDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [labellingStarted, setLabellingStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const getTaskListData = () => {
    const taskObj = new GetTasksByProjectIdAPI(
      id,
      currentPageNumber,
      currentRowPerPage,
      selectedFilters,
      props.type,
      pullvalue,
      rejected,
      pull
    );
    dispatch(APITransport(taskObj));
  };


  const fetchNewTasks = async () => {
    const batchObj =
      props.type === "annotation"
        ? new PullNewBatchAPI(id, Math.round(pullSize))
        : new PullNewReviewBatchAPI(id, Math.round(pullSize));
    const res = await fetch(batchObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(batchObj.getBody()),
      headers: batchObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      if (
        ((props.type === "annotation" &&
          selectedFilters.annotation_status === "unlabeled") ||
          (props.type === "review" &&
            selectedFilters.review_status === "unreviewed")) &&
        currentPageNumber === 1
      ) {
        getTaskListData();
      } else {
        setsSelectedFilters({
          ...selectedFilters,
          task_status: props.type === "annotation" ? "unlabeled" : "labeled",
        });
        setCurrentPageNumber(1);
      }
      const projectObj = new GetProjectDetailsAPI(id);
      dispatch(APITransport(projectObj));
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const unassignTasks = async () => {
    setDeallocateDialog(false);
    // if (ProjectDetails?.project_type === "AcousticNormalisedTranscriptionEditing") {
    //   setSnackbarInfo({
    //     open: true,
    //     message: 'The task de-allocation has been disabled for your project',
    //     variant: "error",
    //   });
    //   return 
    // }
    const deallocateObj =
      props.type === "annotation"
        ? new DeallocateTasksAPI(id, selectedFilters.annotation_status)
        : new DeallocateReviewTasksAPI(id, selectedFilters.review_status);
    const res = await fetch(deallocateObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(deallocateObj.getBody()),
      headers: deallocateObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      getTaskListData();
      setTimeout(() => {
        //window.location.reload();
      }, 1000);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };
  // console.log(selectedFilters);
  const labelAllTasks = () => {
    let search_filters = Object?.keys(selectedFilters)
      .filter((key) => key?.startsWith("search_"))
      .reduce((acc, curr) => {
        acc[curr] = selectedFilters[curr];
        return acc;
      }, {});

    localStorage.setItem("searchFilters", JSON.stringify(search_filters));
    localStorage.setItem("labelAll", true);
    const datavalue = {
      annotation_status: selectedFilters?.annotation_status,
      mode: "annotation",
      ...(props.type === "review" && {
        mode: "review",
        annotation_status: selectedFilters?.review_status,
      }),
    };

    const getNextTaskObj = new GetNextTaskAPI(id, datavalue, null, props.type);
    dispatch(APITransport(getNextTaskObj));
    setLabellingStarted(true);
  };

  const totalTaskCount = useSelector(
    (state) => state.getTasksByProjectId.data.total_count
  );

  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  };

  const handleOpenFindAndReplace =  () => {
    setOpenFindAndReplaceDialog(true)
  };

  const handleSubmitFindAndReplace = async () =>{
    const ReplaceData = {
      user_id: userDetails.id,
      project_id: id,
      task_status:
        props.type === "annotation"
          ? selectedFilters.annotation_status
          : selectedFilters.review_status,
      annotation_type: props.type === "annotation" ? "annotation" : "review",
      find_words: find,
      replace_words: replace,
    };
    const AnnotationObj = new FindAndReplaceWordsInAnnotationAPI(
      id,
      ReplaceData
    );
    dispatch(APITransport(AnnotationObj));
    const res = await fetch(AnnotationObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(AnnotationObj.getBody()),
      headers: AnnotationObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    }
  }

  useEffect(() => {
    localStorage.setItem("Stage", props.type);
  },[]);
  
  const customColumnHead = (col) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "10px",
          flexGrow: "1",
          alignItems: "center",
        }}
      >
        {col.label}
        {!excludeSearch.includes(col.name) && (
          <IconButton
            sx={{ borderRadius: "100%" }}
            onClick={(e) => handleShowSearch(col.name, e)}
          >
            <SearchIcon id={col.name + "_btn"} />
          </IconButton>
        )}
      </Box>
    );
  };

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  useEffect(() => {
    getTaskListData();
  }, [currentPageNumber, currentRowPerPage]);

  useEffect(() => {
    dispatch(SetTaskFilter(id, selectedFilters, props.type));
    if (currentPageNumber !== 1) {
      setCurrentPageNumber(1);
    } else {
      getTaskListData();
    }
    localStorage.setItem(
      "labellingMode",
      props.type === "annotation"
        ? selectedFilters.annotation_status
        : selectedFilters.review_status
    );
  }, [selectedFilters]);
  useEffect(() => {
    if (taskList?.length > 0 && taskList[0]?.data) {
      const data = taskList.map((el) => {
        const email = props.type === "review" ? el.annotator_mail : "";
        let row = [el.id, ...(!!email ? [el.annotator_mail] : [])];
        row.push(
          ...Object.keys(el.data)
            .filter((key) => !excludeCols.includes(key))
            .map((key) => el.data[key])
        );
        props.type === "annotation" &&
          taskList[0].annotation_status &&
          row.push(el.annotation_status);
        props.type === "review" &&
          taskList[0].review_status &&
          row.push(el.review_status);
        props.type === "annotation" &&
          row.push(
            <Link
              to={ProjectDetails?.project_type?.includes("Acoustic")
              ? `AudioTranscriptionLandingPage/${el.id}` : `task/${el.id}`} className={classes.link}>
              <CustomButton
                onClick={() => {
                  console.log("task id === ", el.id);
                  localStorage.removeItem("labelAll");
                }}
                disabled={ ProjectDetails.is_archived }
                sx={{ p: 1, borderRadius: 2 }}
                label={
                  <Typography sx={{ color: "#FFFFFF" }} variant="body2">
                    {(props.type === "annotation" && ProjectDetails?.annotators?.some((a) => a.id === userDetails?.id)) ?
                      (ProjectDetails.project_mode === "Annotation"
                        ? "Annotate"
                        : "Edit")
                      : "View"
                    }
                  </Typography>
                }
              />
            </Link>
          );
        props.type === "review" &&
          row.push(
            <Link
              to={ProjectDetails?.project_type?.includes("Acoustic") || ProjectDetails?.project_type?.includes("StandardizedTranscriptionEditing")
              ? `ReviewAudioTranscriptionLandingPage/${el.id}` : `review/${el.id}`} className={classes.link}>
              <CustomButton
                disabled={ ProjectDetails.is_archived}
                onClick={() => {
                  console.log("task id === ", el.id);
                  localStorage.removeItem("labelAll");
                }}
                sx={{ p: 1, borderRadius: 2 }}
                label={
                  <Typography sx={{ color: "#FFFFFF" }} variant="body2">
                    Review
                  </Typography>
                }
              />
            </Link>
          );
        return row;
      });
      // let colList = ["id"];
      // colList.push(...Object.keys(taskList[0].data).filter(el => !excludeCols.includes(el) && !el.includes("_json")));

      const annotatorEmail = taskList[0]?.hasOwnProperty("annotator_mail")
      const email = props.type === "review" && annotatorEmail ? "Annotator Email" : "";
      let colList = ["id", ...(!!email ? [email] : [])];
      colList.push(
        ...Object.keys(taskList[0].data).filter(
          (el) => !excludeCols.includes(el)
        )
      );
      taskList[0].task_status && colList.push("status");
      colList.push("actions");
      const cols = colList.map((col) => {
        return {
          name: col,
          label: snakeToTitleCase(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            customHeadLabelRender: customColumnHead,
          },
        };
      });
      console.log("colss", cols);
      setColumns(cols);
      setSelectedColumns(colList);
      setTasks(data);
      console.log(colList, "colListcolList");
    } else {
      setTasks([]);
    }
  }, [taskList, ProjectDetails]);

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
    console.log("columnss", newCols);
  }, [selectedColumns]);

  useEffect(() => {
    if (ProjectDetails) {
      if (props.type === "review" && ProjectDetails.labeled_task_count === 0 ||  ProjectDetails.is_archived )
        setPullDisabled("No more unassigned tasks in this project");
      else if (pullDisabled === "No more unassigned tasks in this project")
        setPullDisabled("");
    }
  }, [ProjectDetails.labeled_task_count]);

  useEffect(() => {
    if (ProjectDetails) {
      if (
        props.type === "annotation" &&
        ProjectDetails.unassigned_task_count === 0 || ProjectDetails.is_archived
      )
        setPullDisabled("No more unassigned tasks in this project");
      else if (pullDisabled === "No more unassigned tasks in this project")
        setPullDisabled("");

      ProjectDetails.frozen_users?.forEach((user) => {
        if (user.id === userDetails?.id)
          setPullDisabled("You're no more a part of this project");
        else if (pullDisabled === "You're no more a part of this project")
          setPullDisabled("");
      });
      setPullSize(ProjectDetails.tasks_pull_count_per_batch * 0.5);
    }
  }, [
    ProjectDetails.unassigned_task_count,
    ProjectDetails.frozen_users,
    ProjectDetails.tasks_pull_count_per_batch,
    userDetails,
  ]);

  useEffect(() => {
    if (
      totalTaskCount &&
      ((props.type === "annotation" &&
        selectedFilters.annotation_status === "unlabeled") ||
        (props.type === "review" &&
          selectedFilters.review_status === "unreviewed")) &&
      totalTaskCount >= ProjectDetails?.max_pending_tasks_per_user &&
      Object.keys(selectedFilters).filter((key) =>
        key.startsWith("search_")
      ) === []
    ) {
      setPullDisabled(
        `You have too many ${
          props.type === "annotation"
          ? selectedFilters.annotation_status
          : selectedFilters.review_status
        } tasks`
      );
    } else if (
      pullDisabled === "You have too many unlabeled tasks" ||
      pullDisabled === "You have too many labeled tasks"
    ) {
      setPullDisabled("");
    }
  }, [
    totalTaskCount,
    ProjectDetails.max_pending_tasks_per_user,
    selectedFilters,
  ]);

  useEffect(() => {
    if (
      ((props.type === "annotation" &&
        selectedFilters.annotation_status === "unlabeled") ||
        (props.type === "review" &&
          selectedFilters.review_status === "unreviewed")) &&
      totalTaskCount === 0 ||   ProjectDetails.is_archived
    ) {
      setDeallocateDisabled("No more tasks to deallocate");
    } else if (deallocateDisabled === "No more tasks to deallocate") {
      setDeallocateDisabled("");
    }
  }, [totalTaskCount, selectedFilters,ProjectDetails]);

  useEffect(() => {
    if (ProjectDetails?.project_type?.includes("Acoustic")) {
      if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
        navigate(
          `/projects/${id}/${props.type === "annotation" ? "AudioTranscriptionLandingPage" : "ReviewAudioTranscriptionLandingPage"}/${
            NextTask?.id
          }`
        );
      }
    }else{
      if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
        navigate(
          `/projects/${id}/${props.type === "annotation" ? "task" : "review"}/${
          NextTask?.id
          }`
        );
      }
    }
    //TODO: display no more tasks message
  }, [NextTask]);

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseFindAndReplace =()=>{
    setOpenFindAndReplaceDialog(false)
  }

  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  const renderToolBar = () => {
    // const buttonSXStyle = { borderRadius: 2, margin: 2 }
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        {/* {props.ProjectDetails?.project_type ===
          "ContextualTranslationEditing" && (
          <>
            {(props.type === "annotation" || props.type === "review") &&
              ((props.type === "annotation" &&
                selectedFilters.annotation_status === "labeled") ||
                selectedFilters.review_status === "accepted" ||
                selectedFilters.accepted_with_changes ===
                  "accepted_with_changes") && (
                <Grid container justifyContent="start" alignItems="center">
                  <Grid>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      label="Required"
                    >
                      Find :
                    </Typography>
                  </Grid>
                  <Grid>
                    <OutlinedTextField
                      size="small"
                      name="find"
                      InputProps={{
                        style: { fontSize: "14px", width: "150px" },
                      }}
                      value={find}
                      onChange={(e) => setFind(e.target.value)}
                    />
                  </Grid>
                  <Grid>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      label="Required"
                    >
                      Replace :
                    </Typography>
                  </Grid>
                  <Grid>
                    <OutlinedTextField
                      size="small"
                      name="replace"
                      InputProps={{
                        style: { fontSize: "14px", width: "150px" },
                      }}
                      value={replace}
                      onChange={(e) => setReplace(e.target.value)}
                    />
                  </Grid>
                  <Grid>
                    <CustomButton
                      sx={{
                        inlineSize: "max-content",
                        width: "50px",
                        borderRadius: "20px",
                        
                      }}
                      onClick={handleOpenFindAndReplace}
                      label="Submit"
                      disabled={find && replace  ? false : true}

                    />
                  </Grid>
                </Grid>
              )}
          </>
        )} */}

        {props.type === "annotation" &&
          (roles?.WorkspaceManager === userDetails?.role || roles?.OrganizationOwner === userDetails?.role || roles?.Admin === userDetails?.role )  &&
          !getProjectUsers?.some(
            (annotator) => annotator.id === userDetails?.id
          ) && !getProjectReviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          ) && ! ProjectDetails?.review_supercheckers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          )&& (
            <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
              <InputLabel
                id="annotator-filter-label"
                sx={{
                  fontSize: "16px",
                  position: "inherit",
                  top: "23px",
                  left: "-20px",
                }}
              >
                Filter by Annotator
              </InputLabel>
              <Select
                labelId="annotator-filter-label"
                id="annotator-filter"
                value={selectedFilters.req_user}
                label="Filter by Annotator"
                onChange={(e) =>
                  setsSelectedFilters({
                    ...selectedFilters,
                    req_user: e.target.value,
                  })
                }
                sx={{ fontSize: "16px" }}
              >
                <MenuItem value={-1}>All</MenuItem>
                {filterData.Annotators.map((el, i) => (
                  <MenuItem value={el.value}>{el.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        {props.type === "review" &&
          (roles?.WorkspaceManager === userDetails?.role || roles?.OrganizationOwner === userDetails?.role || roles?.Admin === userDetails?.role ) &&
          !getProjectUsers?.some(
            (annotator) => annotator.id === userDetails?.id
          ) && !getProjectReviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          ) && ! ProjectDetails?.review_supercheckers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          )&&  (
            <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
              <InputLabel
                id="reviewer-filter-label"
                sx={{
                  fontSize: "16px",
                  position: "inherit",
                  top: "23px",
                  left: "-25px",
                }}
              >
                Filter by Reviewer
              </InputLabel>
              <Select
                labelId="reviewer-filter-label"
                id="reviewer-filter"
                value={selectedFilters.req_user}
                label="Filter by Reviewer"
                onChange={(e) =>
                  setsSelectedFilters({
                    ...selectedFilters,
                    req_user: e.target.value,
                  })
                }
                sx={{ fontSize: "16px" }}
              >
                <MenuItem value="">All</MenuItem>
                {filterData.Reviewers?.map((el, i) => (
                  <MenuItem value={el.value}>{el.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
        <Tooltip title="Filter Table">
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
        </Tooltip>
      </Box>
    );
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
        autoHideDuration={2000}
      />
    );
  };

  const options = {
    count: totalTaskCount,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100],
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "currentRowPerPage",
        displayRows: "OF",
      },
    },
    onChangePage: (currentPage) => {
      setCurrentPageNumber(currentPage + 1);
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentPageNumber(1);
      setCurrentRowPerPage(rowPerPageCount);
      console.log("rowPerPageCount", rowPerPageCount);
    },
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    textLabels: {
      body: {
        noMatch: "No records ",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: {
        rowsPerPage: "Rows per page",
      },
      options: { sortDirection: "desc" },
    },
    jumpToPage: true,
    serverSide: true,
    customToolbar: renderToolBar,
  };
  console.log(props.type === "review" ,
    ProjectDetails?.annotation_reviewers,
    userDetails?.id,"valuesdata")

  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      unassignTasks();
    }else{
      window.alert("Invalid credentials, please try again");
      console.log(rsp_data);
    }
  };
  
  return (
    <div>
      {((props.type === "annotation" &&
        ProjectDetails?.annotators?.some(
          (annotation) => annotation.id === userDetails?.id
        )) ||
        (props.type === "review" &&
          ProjectDetails?.annotation_reviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          ))) &&
        (ProjectDetails.project_mode === "Annotation" ? (
          ProjectDetails.is_published ? (
            <Grid container direction="row" spacing={2} sx={{ mb: 2 }}>
              {((props.type === "annotation" &&
                selectedFilters.annotation_status === "unlabeled") ||
                selectedFilters.annotation_status === "draft" ||
                selectedFilters.annotation_status === "skipped" ||
                (props.type === "review" &&
                  selectedFilters.review_status === "unreviewed") ||
                selectedFilters.review_status === "draft" ||
                selectedFilters.review_status === "skipped") && (
                  <Grid item xs={12} sm={12} md={3}>
                    <Tooltip title={deallocateDisabled }>
                      <Box>
                        <CustomButton
                          sx={{
                            p: 1,
                            width: "100%",
                            borderRadius: 2,
                            margin: "auto",
                          }}
                          label={"De-allocate Tasks"}
                          onClick={() => setDeallocateDialog(true)}
                          disabled={deallocateDisabled }
                          color={"warning"}
                        />
                      </Box>
                    </Tooltip>
                  </Grid>
                )}
              <Dialog
                open={deallocateDialog}
                onClose={() => setDeallocateDialog(false)}
                aria-labelledby="deallocate-dialog-title"
                aria-describedby="deallocate-dialog-description"
              >
                <DialogTitle id="deallocate-dialog-title">
                  {"De-allocate Tasks?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    All{" "}
                    <snap style={{ color: "#1DA3CE" }}>
                      {props.type === "annotation"
                        ? selectedFilters.annotation_status
                        : selectedFilters.review_status}{" "}
                      tasks
                    </snap>{" "}
                    will be de-allocated from this project. Please be careful as
                    this action cannot be undone.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setDeallocateDialog(false)}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
              <Grid
                item
                xs={4}
                sm={4}
                md={
                  (props.type === "annotation" &&
                    selectedFilters.annotation_status === "unlabeled") ||
                    selectedFilters.annotation_status === "draft" ||
                    selectedFilters.annotation_status === "skipped" ||
                    (props.type === "review" &&
                      selectedFilters.review_status === "unreviewed") ||
                    selectedFilters.review_status === "draft" ||
                    selectedFilters.review_status === "skipped"
                    ? 2
                    : 3
                }
              >
                <FormControl size="small" sx={{ width: "100%" }}>
                  <InputLabel id="pull-select-label" sx={{ fontSize: "16px" }}>
                    Pull Size
                  </InputLabel>
                  <Select
                    labelId="pull-select-label"
                    id="pull-select"
                    value={pullSize}
                    // defaultValue={5}
                    label="Pull Size"
                    onChange={(e) => setPullSize(e.target.value)}
                    disabled={pullDisabled}
                    sx={{ fontSize: "16px" }}
                  >
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch * 0.5}
                    >
                      {Math.round(
                        ProjectDetails?.tasks_pull_count_per_batch * 0.5
                      )}
                    </MenuItem>
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch}
                    >
                      {ProjectDetails?.tasks_pull_count_per_batch}
                    </MenuItem>
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch * 1.5}
                    >
                      {Math.round(
                        ProjectDetails?.tasks_pull_count_per_batch * 1.5
                      )}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={
                  (props.type === "annotation" &&
                    selectedFilters.annotation_status === "unlabeled") ||
                    selectedFilters.annotation_status === "draft" ||
                    selectedFilters.annotation_status === "skipped" ||
                    (props.type === "review" &&
                      selectedFilters.review_status === "unreviewed") ||
                    selectedFilters.review_status === "draft" ||
                    selectedFilters.review_status === "skipped"
                    ? 3
                    : 4
                }
              >
                <Tooltip title={pullDisabled}>
                  <Box>
                    <CustomButton
                      sx={{
                        p: 1,
                        width: "100%",
                        borderRadius: 2,
                        margin: "auto",
                      }}
                      label={"Pull New Batch"}
                      disabled={pullDisabled}
                      onClick={fetchNewTasks}
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={
                  (props.type === "annotation" &&
                    selectedFilters.annotation_status === "unlabeled") ||
                    selectedFilters.annotation_status === "draft" ||
                    selectedFilters.annotation_status === "skipped" ||
                    (props.type === "review" &&
                      selectedFilters.review_status === "unreviewed") ||
                    selectedFilters.review_status === "draft" ||
                    selectedFilters.review_status === "skipped"
                    ? 4
                    : 5
                }
              >
                <Tooltip
                  title={
                    totalTaskCount === 0
                      ? props.type === "annotation"
                        ? "No more tasks to label"
                        : "No more tasks to review"
                      : ""
                  }
                >
                  <Box>
                    <CustomButton
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        margin: "auto",
                        width: "100%",
                      }}
                      label={
                        props.type === "annotation"
                          ? "Start Labelling Now"
                          : "Start reviewing now"
                      }
                      onClick={labelAllTasks}
                      disabled={totalTaskCount === 0 ||  ProjectDetails.is_archived }
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          ) : (
            <Button
              type="primary"
              style={{
                width: "100%",
                marginBottom: "1%",
                marginRight: "1%",
                marginTop: "1%",
              }}
            >
              Disabled
            </Button>
          )
        ) : (
          <CustomButton
            sx={{
              p: 1,
              width: "98%",
              borderRadius: 2,
              mb: 3,
              ml: "1%",
              mr: "1%",
              mt: "1%",
            }}
            label={"Add New Item"}
          />
        ))}
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={tasks}
          columns={columns}
          options={options}
        // filter={false}
        />
      </ThemeProvider>
      {searchOpen && (
        <SearchPopup
          open={searchOpen}
          anchorEl={searchAnchor}
          handleClose={handleSearchClose}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          searchedCol={searchedCol}
        />
      )}
      {popoverOpen && (
        <FilterList
          id={filterId}
          open={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filterStatusData={filterData}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          pull={pull}
          setpull={setpull}
          rejected={rejected}
          setRejected={setRejected}
          // rejValue = {rejValue}
          pullvalue={pullvalue}
        />
      )}
      {OpenFindAndReplaceDialog && (
        <FindAndReplaceDialog
          OpenFindAndReplaceDialog={OpenFindAndReplaceDialog}
          handleCloseFindAndReplace={handleCloseFindAndReplace}
          find={find}
          replace={replace}
          selectedFilters={selectedFilters}
          Type={props.type}
          submit={() => handleSubmitFindAndReplace()}
        />
      )}

      {renderSnackBar()}
      {loading && <Spinner />}
    </div>
  );
};

export default TaskTable;
