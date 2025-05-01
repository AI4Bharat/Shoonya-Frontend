import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../../theme/tableTheme";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import themeDefault from "../../../theme/theme";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../component/common/Button";
import ColumnList from "../../component/common/ColumnList";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import MUIDataTable from "mui-datatables";
import MenuItems from "../../component/common/MenuItems";
import { useDispatch, useSelector } from "react-redux";
import CreateProjectAPI from "../../../../redux/actions/api/ProjectDetails/CreateProject";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetDatasetsByTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetsByType";
import GetDatasetFieldsAPI from "../../../../redux/actions/api/Dataset/GetDatasetFields";
import GetLanguageChoicesAPI from "../../../../redux/actions/api/ProjectDetails/GetLanguageChoices";
import GetDataitemsByIdAPI from "../../../../redux/actions/api/Dataset/GetDataitemsById";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { snakeToTitleCase } from "../../../../utils/utils";
import Spinner from "../../component/common/Spinner";
import SearchIcon from "@mui/icons-material/Search";
import DatasetSearchPopup from "../../container/Dataset/DatasetSearchPopup";
import DatasetSearchPopupAPI from "../../../../redux/actions/api/Dataset/DatasetSearchPopup";
import { MenuProps } from "../../../../utils/utils";

const isNum = (str) => {
  var reg = new RegExp("^[0-9]*$");
  return reg.test(String(str));
};
const projectStage = [
  { name: "Annotation Stage", value: 1 },
  { name: "Review Stage", value: 2 },
  { name: "Super-Check Stage", value: 3 },
];

const CreateAnnotationsAutomatically = [
  { name: "None", value: "none" },
  { name: "Annotation", value: "annotation" },
  { name: "Review", value: "review" },
  { name: "Supercheck", value: "supercheck" },
];

const AnnotationProject = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const User = useSelector((state) => state.fetchLoggedInUserData.data);
  const NewProject = useSelector((state) => state.createProject.data);
  const ProjectDomains = useSelector((state) => state.getProjectDomains.data);
  const DatasetInstances = useSelector((state) => state.getDatasetsByType.data);
  const DatasetFields = useSelector((state) => state.getDatasetFields.data);
  const LanguageChoices = useSelector((state) => state.getLanguageChoices.data);
  const DataItems = useSelector((state) => state.getDataitemsById.data);
  const filterdataitemsList = useSelector(
    (state) => state.datasetSearchPopup.data
  );

  const [domains, setDomains] = useState([]);
  const [projectTypes, setProjectTypes] = useState(null);
  const [datasetTypes, setDatasetTypes] = useState(null);
  const [instanceIds, setInstanceIds] = useState(null);
  const [columnFields, setColumnFields] = useState(null);
  const [variableParameters, setVariableParameters] = useState(null);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [searchedCol, setSearchedCol] = useState();
  //Form related state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [samplingMode, setSamplingMode] = useState(null);
  const [random, setRandom] = useState("");
  const [batchSize, setBatchSize] = useState();
  const [batchNumber, setBatchNumber] = useState([]);
  const [samplingParameters, setSamplingParameters] = useState(null);
  const [selectedInstances, setSelectedInstances] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedAnnotatorsNum, setSelectedAnnotatorsNum] = useState(1);
  const [filterString, setFilterString] = useState(null);
  const [selectedVariableParameters, setSelectedVariableParameters] = useState(
    []
  );
  const [taskReviews, setTaskReviews] = useState(1);
  const [variable_Parameters_lang, setVariable_Parameters_lang] = useState("");
  //Table related state variables
  const [columns, setColumns] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalDataitems, setTotalDataitems] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [selectedFilters, setsSelectedFilters] = useState({});
  const [createannotationsAutomatically, setsCreateannotationsAutomatically] =
    useState("none");
  const [acousticEnabledStage, setAcousticEnabledStage] = useState(null);

  const searchOpen = Boolean(searchAnchor);
  const excludeKeys = [
    "parent_data_id",
    // "metadata_json",
    "instance_id_id",
    "datasetbase_ptr_id",
    "key",
    "instance_id",
    "labse_score",
    "parent_data",
    "id",
    "rating",
    // "conversation_json",
    "machine_translated_conversation_json",
    "speakers_json",
    // "transcribed_json",
    "conversation_json",
    // "prediction_json",
    "machine_transcribed_json",
    "unverified_conversation_json",
    "annotation_bboxes",
    "annotation_labels",
    "annotation_transcripts",
  ];
  const renderToolBar = () => {
    return (
      <Grid container spacing={0} md={12}>
        <Grid
          item
          xs={8}
          sm={8}
          md={12}
          lg={12}
          xl={12}
          className={classes.filterToolbarContainer}
        >
          <Grid container direction="row" justifyContent={"flex-end"}>
            <ColumnList
              columns={columns}
              setColumns={setSelectedColumns}
              selectedColumns={selectedColumns}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };
  const customColumnHead = (col) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "5px",
          flexGrow: "1",
          alignItems: "center",
        }}
      >
        {col.label}
        <IconButton
          sx={{ borderRadius: "100%" }}
          onClick={(e) => handleShowSearch(col.name, e)}
        >
          <SearchIcon id={col.name + "_btn"} />
        </IconButton>
      </Box>
    );
  };
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

  const options = {
    count: totalDataitems,
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
      setCurrentRowPerPage(rowPerPageCount);
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

  useEffect(() => {
    const domainObj = new GetProjectDomainsAPI();
    dispatch(APITransport(domainObj));
  }, []);

  useEffect(() => {
    setTotalDataitems(filterdataitemsList.count);
    setTableData(filterdataitemsList.results);
  }, [filterdataitemsList.results]);

  useEffect(() => {
    if (NewProject.id) {
      navigate(`/projects/${NewProject.id}`, { replace: true });
      window.location.reload();
    }
  }, [NewProject]);
  useEffect(() => {
    getsearchdataitems();
  }, [currentPageNumber, currentRowPerPage, selectedFilters]);

  useEffect(() => {
    if (User) {
      const tempDomains = [];
      const tempTypes = {};
      const tempDatasetTypes = {};
      const tempColumnFields = {};
      let tempVariableParameters = {};
      for (const domain in ProjectDomains) {
        tempDomains.push(domain);
        const tempTypesArr = [];
        for (const project_type in ProjectDomains[domain]["project_types"]) {
          if (
            ProjectDomains[domain]["project_types"][project_type]
              .project_mode === "Annotation"
          ) {
            tempTypesArr.push(project_type);
          }

          if (
            ProjectDomains[domain]["project_types"][project_type][
              "input_dataset"
            ]
          ) {
            tempDatasetTypes[project_type] =
              ProjectDomains[domain]["project_types"][project_type][
                "input_dataset"
              ]["class"];
            tempColumnFields[project_type] =
              ProjectDomains[domain]["project_types"][project_type][
                "input_dataset"
              ]["fields"];
          }
          let temp =
            ProjectDomains[domain]["project_types"][project_type][
              "output_dataset"
            ]["fields"]["variable_parameters"];
          if (temp) {
            tempVariableParameters[project_type] = {
              variable_parameters: temp,
              output_dataset:
                ProjectDomains[domain]["project_types"][project_type][
                  "output_dataset"
                ]["class"],
            };
          }
        }
        tempTypes[domain] = tempTypesArr;
      }
      setDomains(
        tempDomains.map((key) => {
          return {
            name: key,
            value: key,
          };
        })
      );
      setVariableParameters(tempVariableParameters);
      setProjectTypes(tempTypes);
      setDatasetTypes(tempDatasetTypes);
      setColumnFields(tempColumnFields);
    }
  }, [ProjectDomains]);

  useEffect(() => {
    let tempInstanceIds = {};
    for (const instance in DatasetInstances) {
      tempInstanceIds[DatasetInstances[instance]["instance_id"]] =
        DatasetInstances[instance]["instance_name"];
    }
    setInstanceIds(tempInstanceIds);
  }, [DatasetInstances]);

  useEffect(() => {
    if (variableParameters && variableParameters[selectedType]) {
      let temp = [];
      variableParameters[selectedType]["variable_parameters"].forEach(
        (element) => {
          temp.push({
            name: element,
            data: DatasetFields[element],
            value: variable_Parameters_lang,
          });
        }
      );
      setSelectedVariableParameters(temp);
    }
  }, [DatasetFields, variable_Parameters_lang]);

  useEffect(() => {
    if (LanguageChoices && LanguageChoices.length > 0) {
      let temp = [];
      LanguageChoices.forEach((element) => {
        temp.push({
          name: element[0],
          value: element[0],
        });
      });
      setLanguageOptions(temp);
    }
  }, [LanguageChoices]);

  useEffect(() => {
    setTotalDataitems(DataItems.count);
    let fetchedItems = DataItems.results;
    setTableData(fetchedItems);
    let tempColumns = [];
    let tempSelected = [];
    if (fetchedItems?.length) {
      Object.keys(fetchedItems[0]).forEach((keys) => {
        if (!excludeKeys.includes(keys)) {
          tempColumns.push({
            name: keys,
            label: snakeToTitleCase(keys),
            options: {
              filter: false,
              sort: false,
              align: "center",
              customHeadLabelRender: customColumnHead,
              customBodyRender: (value) => {
                if (keys.includes("json") && value !== null) {
                  const data = JSON.stringify(value);
                  const metadata = data.replace(/\\/g, "");
                  return metadata;
                } else {
                  return value;
                }
              },
            },
          });
          tempSelected.push(keys);
        }
      });
    }
    setColumns(tempColumns);
    setSelectedColumns(tempSelected);
  }, [DataItems]);

  useEffect(() => {
    setSelectedType("");
    setSamplingParameters(null);
    setConfirmed(false);
    if (
      selectedDomain === "Translation" ||
      selectedDomain === "Conversation" ||
      selectedDomain === "Monolingual" ||
      selectedDomain === "Audio"
    ) {
      const langChoicesObj = new GetLanguageChoicesAPI();
      dispatch(APITransport(langChoicesObj));
    }
    setTableData([]);
    setCurrentPageNumber(1);
    setCurrentRowPerPage(10);
  }, [selectedDomain]);

  useEffect(() => {
    setSelectedInstances([]);
    setSamplingParameters(null);
    setConfirmed(false);
    setTableData([]);
    setCurrentPageNumber(1);
    setCurrentRowPerPage(10);
    if (selectedType) {
      if (variableParameters[selectedType]) {
        const fieldsObj = new GetDatasetFieldsAPI(
          variableParameters[selectedType]["output_dataset"]
        );
        dispatch(APITransport(fieldsObj));
      } else {
        setSelectedVariableParameters([]);
      }
    }
  }, [selectedType]);

  useEffect(() => {
    if (batchSize && batchNumber) {
      setSamplingParameters({
        batch_size: batchSize,
        batch_number: new Function("return [" + [batchNumber] + "]")(),
      });
    } else {
      setSamplingParameters(null);
    }
  }, [batchSize, batchNumber]);

  const onSelectDomain = (value) => {
    setSelectedDomain(value);
  };

  const onSelectProjectType = (value) => {
    setSelectedType(value);
    const instancesObj = new GetDatasetsByTypeAPI(datasetTypes[value]);
    dispatch(APITransport(instancesObj));
  };

  const onSelectInstances = (e) => {
    setSelectedInstances(e.target.value);
    setSamplingMode(null);
    setSamplingParameters(null);
  };

  const handleChangeInstances = () => {
    setConfirmed(false);
    setTableData([]);
    setCurrentPageNumber(1);
    setCurrentRowPerPage(10);
    setSamplingMode(null);
    setSamplingParameters(null);
  };

  const handleVariableParametersChange = (key, value) => {
    let temp = [...selectedVariableParameters];
    temp.forEach((element) => {
      if (element.name === key) {
        element.value = value;
      }
    });
    setSelectedVariableParameters(temp);
  };

  const onSelectSamplingMode = (value) => {
    setSamplingMode(value);
    if (value === "f") {
      setSamplingParameters({});
    }
  };

  const handleRandomChange = (e) => {
    setRandom(e.target.value);
    setSamplingParameters(
      e.target.value ? { fraction: parseFloat(e.target.value / 100) } : null
    );
  };

  const onConfirmSelections = () => {
    setConfirmed(true);
    getDataItems();
  };
  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  };

  useEffect(() => {
    if (selectedInstances && datasetTypes) {
      getDataItems();
    }
  }, [currentPageNumber, currentRowPerPage]);

  const getDataItems = () => {
    const dataObj = new GetDataitemsByIdAPI(
      selectedInstances,
      datasetTypes[selectedType],
      selectedFilters,
      currentPageNumber,
      currentRowPerPage
    );
    dispatch(APITransport(dataObj));
  };

  const getsearchdataitems = () => {
    const searchPopupdata = {
      instance_ids: selectedInstances,
      search_keys: selectedFilters,
    };
    const taskObj = new DatasetSearchPopupAPI(searchPopupdata);
    dispatch(APITransport(taskObj));
  };

  const processNameString = (string) => {
    let temp = "";
    string.split("_").forEach((element) => {
      temp += element.charAt(0).toUpperCase() + element.slice(1) + " ";
    });
    return temp;
  };

  const handleCreateProject = () => {
    let temp = {};
    selectedVariableParameters.forEach((element) => {
      temp[element.name] = element.value;
    });

    const newProject = {
      title: title,
      description: description,
      created_by: User?.id,
      is_archived: false,
      is_published: false,
      users: [User?.id],
      workspace_id: id,
      organization_id: User?.organization?.id,
      filter_string: filterString,
      sampling_mode: samplingMode,
      sampling_parameters_json: samplingParameters,
      project_type: selectedType,
      dataset_id: selectedInstances,
      label_config: "string",
      variable_parameters: temp,
      project_mode: "Annotation",
      required_annotators_per_task: selectedAnnotatorsNum,
      project_stage: taskReviews,
      ...(createannotationsAutomatically !== "none" && {
        automatic_annotation_creation_mode: createannotationsAutomatically,
      }),
      acoustic_enabled_stage: acousticEnabledStage,
    };

    if (sourceLanguage) newProject["src_language"] = sourceLanguage;
    if (targetLanguage) newProject["tgt_language"] = targetLanguage;
    const projectObj = new CreateProjectAPI(newProject);
    dispatch(APITransport(projectObj));
  };

  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  const handleReviewToggle = async (e) => {
    setTaskReviews(e.target.value);
  };

  const handleChangeCreateAnnotationsAutomatically = (e) => {
    setsCreateannotationsAutomatically(e.target.value);
  };

  return (
    <ThemeProvider theme={themeDefault}>
      {/* <Header /> */}
      {/* <Grid
                container
                direction='row'
                justifyContent='left'
                alignItems='left'


            >
                <Grid
                    item
                    xs={5}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                > */}
      <Grid container direction="row">
        <Card className={classes.workspaceCard}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ pb: "6rem" }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Create a Project
              </Typography>
            </Grid>

            <Grid container direction="row">
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className={classes.projectsettingGrid}
              >
                <Typography gutterBottom component="div" label="Required">
                  Title:
                </Typography>
              </Grid>
              <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                <OutlinedTextField
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Description:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {domains && (
              <>
                <Grid
                  className={classes.projectsettingGrid}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div">
                    Select a Category to Work in:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={domains}
                    handleChange={onSelectDomain}
                    value={selectedDomain}
                  />
                </Grid>
              </>
            )}

            {selectedDomain && (
              <>
                <Grid
                  className={classes.projectsettingGrid}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div">
                    Select a Project Type:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={projectTypes[selectedDomain].map((key) => {
                      return {
                        name: key,
                        value: key,
                      };
                    })}
                    handleChange={onSelectProjectType}
                    value={selectedType}
                  />
                </Grid>
              </>
            )}

            {selectedType &&
              variableParameters?.[selectedType]?.variable_parameters !==
                undefined && (
                <>
                  <Grid
                    className={classes.projectsettingGrid}
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Typography gutterBottom component="div">
                      Variable Parameters:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                    <OutlinedTextField
                      fullWidth
                      value={variable_Parameters_lang}
                      onChange={(e) =>
                        setVariable_Parameters_lang(e.target.value)
                      }
                    />
                  </Grid>
                </>
              )}
            {(selectedDomain === "Translation" ||
              selectedDomain === "Conversation") &&
              (selectedType === "TranslationEditing" ||
                selectedType === "SemanticTextualSimilarity" ||
                selectedType === "ContextualTranslationEditing" ||
                selectedType === "ConversationTranslation" ||
                selectedType === "ConversationTranslationEditing") && (
                <>
                  <Grid
                    className={classes.projectsettingGrid}
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Typography gutterBottom component="div">
                      Source Language:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                    <FormControl fullWidth>
                      <Select
                        fullWidth
                        labelId="select-Language"
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        style={{ zIndex: "0" }}
                        inputProps={{ "aria-label": "Without label" }}
                        MenuProps={MenuProps}
                      >
                        {languageOptions?.map((item, index) => (
                          <MenuItem key={index} value={item.value}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    className={classes.projectsettingGrid}
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Typography gutterBottom component="div">
                      Target Language:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                    <FormControl fullWidth>
                      <Select
                        fullWidth
                        labelId="select-Language"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        style={{ zIndex: "0" }}
                        inputProps={{ "aria-label": "Without label" }}
                        MenuProps={MenuProps}
                      >
                        {languageOptions?.map((item, index) => (
                          <MenuItem key={index} value={item.value}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

            {(selectedDomain === "Monolingual" ||
              selectedDomain === "Translation" ||
              selectedDomain === "Audio") &&
              (selectedType === "SentenceSplitting" ||
                selectedType === "ContextualSentenceVerification" ||
                selectedType === "MonolingualTranslation" ||
                selectedType === "SingleSpeakerAudioTranscriptionEditing" ||
                selectedType === "AudioTranscription" ||
                selectedType === "AudioSegmentation" ||
                selectedType === "AudioTranscriptionEditing" ||
                selectedType === "AcousticNormalisedTranscriptionEditing") && (
                <>
                  <Grid
                    className={classes.projectsettingGrid}
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Typography gutterBottom component="div">
                      {selectedType === "SingleSpeakerAudioTranscriptionEditing"
                        ? "Language:"
                        : "Target Language:"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                    <FormControl fullWidth>
                      <Select
                        fullWidth
                        labelId="select-Language"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        style={{ zIndex: "0" }}
                        inputProps={{ "aria-label": "Without label" }}
                        MenuProps={MenuProps}
                      >
                        {languageOptions?.map((item, index) => (
                          <MenuItem key={index} value={item.value}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

            {instanceIds && (
              <>
                {selectedVariableParameters.map((parameter, index) => (
                  <>
                    {selectedType === "Conversation" &&
                      (selectedType === "ContextualTranslationEditing" ||
                        selectedType === "ConversationTranslation") && (
                        <Grid
                          className={classes.projectsettingGrid}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                        >
                          <Typography gutterBottom component="div">
                            {processNameString(parameter["name"])}:
                          </Typography>
                        </Grid>
                      )}
                    <Grid
                      className={classes.projectsettingGrid}
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      {parameter?.data["choices"] !== undefined ? (
                        <>
                          {selectedType === "Conversation" &&
                            (selectedType === "ContextualTranslationEditing" ||
                              selectedType === "ConversationTranslation") && (
                              <MenuItems
                                menuOptions={parameter?.data["choices"].map(
                                  (element) => {
                                    return {
                                      name: element[0],
                                      value: element[0],
                                    };
                                  }
                                )}
                                value={
                                  selectedVariableParameters[index]["value"]
                                }
                                handleChange={(e) =>
                                  handleVariableParametersChange(
                                    parameter["name"],
                                    e
                                  )
                                }
                              ></MenuItems>
                            )}
                        </>
                      ) : (
                        <>
                          {parameter.data["name"] === "DecimalField" ||
                          parameter.data["name"] === "IntegerField" ? (
                            <OutlinedTextField
                              fullWidth
                              defaultValue={
                                selectedVariableParameters[index]["value"]
                              }
                              handleChange={(e) =>
                                handleVariableParametersChange(
                                  parameter["name"],
                                  e
                                )
                              }
                              inputProps={{
                                step: 1,
                                min: 0,
                                max: 99999,
                                type: "number",
                              }}
                            />
                          ) : (
                            <OutlinedTextField
                              fullWidth
                              value={selectedVariableParameters[index]["value"]}
                              onChange={(e) =>
                                handleVariableParametersChange(
                                  parameter["name"],
                                  e
                                )
                              }
                            />
                          )}
                        </>
                      )}
                    </Grid>
                  </>
                ))}
                {selectedType && Object.keys(instanceIds).length > 0 && (
                  <>
                    <Grid
                      className={classes.projectsettingGrid}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <Typography gutterBottom component="div">
                        Select sources to fetch data from:
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                      <FormControl
                        fullWidth
                        sx={{ minWidth: 120 }}
                        disabled={confirmed}
                      >
                        <Select
                          fullWidth
                          style={{ zIndex: "0" }}
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          onChange={onSelectInstances}
                          value={selectedInstances}
                          multiple={true}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((key) => (
                                <Chip
                                  key={key}
                                  label={instanceIds[key]}
                                  deleteIcon={
                                    <CancelIcon
                                      onMouseDown={(event) =>
                                        event.stopPropagation()
                                      }
                                    />
                                  }
                                  onDelete={
                                    confirmed
                                      ? undefined
                                      : () => {
                                          setSelectedInstances(
                                            selectedInstances.filter(
                                              (instance) => instance !== key
                                            )
                                          );
                                        }
                                  }
                                />
                              ))}
                            </Box>
                          )}
                        >
                          {Object.keys(instanceIds).map((key) => (
                            <MenuItem key={instanceIds[key]} value={key}>
                              {instanceIds[key]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sm={12}
                      sx={{ margin: "20px 0px 10px 0px" }}
                    >
                      {selectedInstances.length > 0 && (
                        <>
                          <Button
                            onClick={onConfirmSelections}
                            style={{ margin: "0px 20px 0px 0px" }}
                            label={"Confirm Selections"}
                            disabled={confirmed}
                          />
                          <Button
                            onClick={handleChangeInstances}
                            label={"Change Sources"}
                            disabled={!confirmed}
                          />
                        </>
                      )}
                    </Grid>
                  </>
                )}
              </>
            )}
            {selectedType && selectedInstances.length > 0 && confirmed && (
              <>
                <Grid
                  className={classes.projectsettingGrid}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div">
                    Dataset Rows:
                  </Typography>
                </Grid>
                <Grid
                  className={classes.projectsettingGrid}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <ThemeProvider theme={tableTheme}>
                    <div ref={tableRef}>
                      {isBrowser ? (
                        <MUIDataTable
                          key={`table-${displayWidth}`}
                          title={""}
                          data={tableData}
                          columns={columns.filter((column) =>
                            selectedColumns.includes(column.name)
                          )}
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
                </Grid>
                <Grid
                  className={classes.projectsettingGrid}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div">
                    Select Sampling Type:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={["Random", "Full", "Batch"].map((mode) => {
                      return {
                        name: mode,
                        value: mode[0].toLowerCase(),
                      };
                    })}
                    handleChange={onSelectSamplingMode}
                    defaultValue=""
                  />
                </Grid>

                <Grid
                  className={classes.projectsettingGrid}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div">
                    Filter String:
                  </Typography>
                </Grid>

                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <OutlinedTextField
                    fullWidth
                    value={filterString}
                    onChange={(e) => {
                      setFilterString(e.target.value);
                    }}
                  />
                </Grid>
              </>
            )}
            {samplingMode === "r" && (
              <>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={classes.projectsettingGrid}
                >
                  <Typography gutterBottom component="div" label="Required">
                    Sampling Percentage:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    value={random}
                    onChange={handleRandomChange}
                  />
                </Grid>
              </>
            )}
            {samplingMode === "b" && (
              <>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={classes.projectsettingGrid}
                >
                  <Typography gutterBottom component="div" label="Required">
                    Enter Batch size:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    type="number"
                    inputProps={{ type: "number" }}
                    value={batchSize}
                    onChange={(e) =>
                      isNum(e.target.value) &&
                      setBatchSize(Number(e.target.value) || e.target.value)
                    }
                  />
                </Grid>

                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={classes.projectsettingGrid}
                >
                  <Typography gutterBottom component="div" label="Required">
                    Enter Batch Number:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    // type="number"
                    // inputProps={{ type: "number" }}
                    value={batchNumber}
                    onChange={(e) =>
                      // isNum(e.target.value) &&
                      setBatchNumber(e.target.value)
                    }
                  />
                </Grid>
              </>
            )}
            {samplingParameters && (
              <>
                <Grid
                  className={classes.projectsettingGrid}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div" label="Required">
                    Annotators Per Task:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    value={selectedAnnotatorsNum}
                    onChange={(e) => setSelectedAnnotatorsNum(e.target.value)}
                  />
                </Grid>
              </>
            )}
            {confirmed && (
              <>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={classes.projectsettingGrid}
                >
                  <Typography gutterBottom component="div" label="Required">
                    Project Stage:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.formControl}>
                    <Select
                      labelId="task-Reviews-label"
                      id="task-Reviews-select"
                      value={taskReviews}
                      onChange={handleReviewToggle}
                    >
                      {projectStage.map((type, index) => (
                        <MenuItem value={type.value} key={index}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={classes.projectsettingGrid}
                >
                  <Typography gutterBottom component="div" label="Required">
                    Create Annotations Automatically:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.formControl}>
                    <Select
                      labelId="task-Reviews-label"
                      id="task-Reviews-select"
                      value={createannotationsAutomatically}
                      onChange={handleChangeCreateAnnotationsAutomatically}
                    >
                      {CreateAnnotationsAutomatically.map((type, index) => (
                        <MenuItem value={type.value} key={index}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {selectedType === "AcousticNormalisedTranscriptionEditing" && (
                  <>
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className={classes.projectsettingGrid}
                    >
                      <Typography gutterBottom component="div" label="Required">
                        Acoustic Enabled Stage:
                      </Typography>
                    </Grid>
                    <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                      <FormControl fullWidth className={classes.formControl}>
                        <Select
                          labelId="acoustic-label"
                          id="acoustic-select"
                          value={acousticEnabledStage}
                          onChange={(e) =>
                            setAcousticEnabledStage(e.target.value)
                          }
                        >
                          {projectStage.map((type, index) => (
                            <MenuItem value={type.value} key={index}>
                              {type.name.split(/(?<=^\S+)\s/)[0]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </>
            )}

            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Finalize Project
              </Typography>
            </Grid>

            <Grid
              className={classes.projectsettingGrid}
              style={{}}
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
            >
              {/* {title !== "" && selectedType !== "" && ( */}
              <Button
                style={{ margin: "0px 20px 0px 0px" }}
                label={"Create Project"}
                onClick={handleCreateProject}
                disabled={
                  title &&
                  description &&
                  selectedDomain &&
                  selectedType &&
                  selectedInstances &&
                  domains &&
                  samplingMode &&
                  selectedVariableParameters
                    ? false
                    : true
                }
              />
              {/* )}  */}
              <Button
                label={"Cancel"}
                onClick={() => navigate(`/workspaces/${id}`)}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12} />
          </Grid>
        </Card>{" "}
      </Grid>
      {/* </Grid>
            </Grid> */}
      {searchOpen && (
        <DatasetSearchPopup
          open={searchOpen}
          anchorEl={searchAnchor}
          handleClose={handleSearchClose}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          searchedCol={searchedCol}
        />
      )}
    </ThemeProvider>
  );
};

export default AnnotationProject;
