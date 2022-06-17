import { Box, Chip, Grid, ThemeProvider, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StandardTextField from "../../component/common/StandardTextField";
import NativeSelect from "@mui/material/NativeSelect";
import MenuItems from "../../component/common/MenuItems";
import { useDispatch, useSelector } from "react-redux";
import CreateProjectAPI from "../../../../redux/actions/api/ProjectDetails/CreateProject";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetDatasetsByTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetsByType";
import GetDatasetFieldsAPI from "../../../../redux/actions/api/Dataset/GetDatasetFields";
import APITransport from "../../../../redux/actions/apitransport/apitransport";

const AnnotationProject = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const User = useSelector((state) => state.fetchLoggedInUserData.data);
  const NewProject = useSelector((state) => state.createProject.data);
  const ProjectDomains = useSelector((state) => state.getProjectDomains.data);
  const DatasetInstances = useSelector(
    (state) => state.getDatasetsByType.data
  );
  const DatasetFields = useSelector((state) => state.getDatasetFields.data);

  const [domains, setDomains] = useState([]);
  const [projectTypes, setProjectTypes] = useState(null);
  const [datasetTypes, setDatasetTypes] = useState(null);
  const [instanceIds, setInstanceIds] = useState(null);
  const [columnFields, setColumnFields] = useState(null);
  const [variableParameters, setVariableParameters] = useState(null);

  //Form related state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [samplingMode, setSamplingMode] = useState(null);
  const [random, setRandom] = useState(5);
  const [batchSize, setBatchSize] = useState(null);
  const [batchNumber, setBatchNumber] = useState(null);
  const [samplingParameters, setSamplingParameters] = useState(null);
  const [selectedInstances, setSelectedInstances] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedAnnotatorsNum, setSelectedAnnotatorsNum] = useState(1);
  const [filterString, setFilterString] = useState("");
  const [selectedVariableParameters, setSelectedVariableParameters] = useState(
    []
  );

  useEffect(() => {
    const domainObj = new GetProjectDomainsAPI();
    dispatch(APITransport(domainObj));
  }, []);

  useEffect(() => {
    if (NewProject.id) {
      navigate(`/projects/${NewProject.id}`, { replace: true });
    }
  }, [NewProject]);

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
            value: "",
          });
        }
      );
      setSelectedVariableParameters(temp);
    }
  }, [DatasetFields]);

  useEffect(() => {
    setSelectedType("");
    setSamplingParameters(null);
    setConfirmed(false);
    //setTableData(null);
  }, [selectedDomain]);

  useEffect(() => {
    setSelectedInstances([]);
    setSamplingParameters(null);
    setConfirmed(false);
    //setTableData(false);
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
        batch_number: batchNumber,
      });
    }
  }, [batchSize, batchNumber]);

  const onSelectDomain = (value) => {
    setSelectedDomain(value);
  };

  const onSelectProjectType = (value) => {
    setSelectedType(value);
    /* let tempColumns = [];
        for (const column in columnFields[value]) {
        tempColumns.push({
            title: columnFields[value][column],
            dataIndex: columnFields[value][column],
            key: columnFields[value][column],
            ellipsis: true,
        });
        }
        setColumns(tempColumns); */
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
    //setTableData(null);
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

  const handleRandomChange = (value) => {
    setRandom(value);
    setSamplingParameters({
      fraction: parseFloat(value / 100),
    });
  };

  const handleBatchSizeChange = (value) => {
    setBatchSize(value);
  };

  const handleBatchNumberChange = (value) => {
    setBatchNumber(value);
  };

  const onConfirmSelections = () => {
    setConfirmed(true);
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
    //showLoader();
    const newProject = {
      title: title,
      description: description,
      created_by: User.id,
      is_archived: false,
      is_published: false,
      users: [User?.id],
      workspace_id: id,
      organization_id: User.organization.id,
      filter_string: filterString,
      sampling_mode: samplingMode,
      sampling_parameters_json: samplingParameters,
      project_type: selectedType,
      dataset_id: selectedInstances,
      label_config: "string",
      variable_parameters: temp,
      project_mode: "Annotation",
      required_annotators_per_task: selectedAnnotatorsNum,
    };
    const projectObj = new CreateProjectAPI(newProject);
    dispatch(APITransport(projectObj));
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
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h2" gutterBottom component="div">
              Create a Project
            </Typography>
          </Grid>

          <Grid container direction="row">
            <Grid
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
                  Select a domain to work in:
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

          {instanceIds && (
            <>
              {selectedVariableParameters.map((parameter, index) => (
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
                      {processNameString(parameter["name"])}
                    </Typography>
                  </Grid>
                  <Grid
                    className={classes.projectsettingGrid}
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    {parameter.data["choices"] !== undefined ? (
                      <MenuItems
                        menuOptions={parameter.data["choices"].map(
                          (element) => {
                            return {
                              name: element[0],
                              value: element[0],
                            };
                          }
                        )}
                        value={selectedVariableParameters[index]["value"]}
                        handleChange={(e) =>
                          handleVariableParametersChange(parameter["name"], e)
                        }
                      ></MenuItems>
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
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        onChange={onSelectInstances}
                        value={selectedInstances}
                        multiple={true}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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
                                onDelete={() => {
                                  if (!confirmed) {
                                    setSelectedInstances(
                                      selectedInstances.filter(
                                        (instance) => instance !== key
                                      )
                                    );
                                  }
                                }}
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
                        />
                        <Button
                          onClick={handleChangeInstances}
                          label={"Change Sources"}
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
                  value={batchSize}
                  onChange={handleBatchSizeChange}
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
                  value={batchNumber}
                  onChange={handleBatchNumberChange}
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
                  onChange={(e) => {
                    setSelectedAnnotatorsNum(e.target.value);
                  }}
                />
              </Grid>
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
            {title !== "" && selectedType !== "" && (
              <Button
                style={{ margin: "0px 20px 0px 0px" }}
                label={"Create Project"}
                onClick={handleCreateProject}
              />
            )}
            <Button
              label={"Cancel"}
              onClick={() => navigate(`/workspaces/${id}`)}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} sm={12} />
        </Grid>
      </Grid>
      {/* </Grid>
            </Grid> */}
    </ThemeProvider>
  );
};

export default AnnotationProject;
