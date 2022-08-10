
import React, { useState, useEffect } from "react";
import { Radio, Box } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import DatasetCardList from "./DatasetCardList";
import DatasetCard from "./DatasetCard";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from 'react-redux';
import GetDatasetsAPI from "../../../../redux/actions/api/Dataset/GetDatasetList";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../component/common/Button";
import Spinner from "../../component/common/Spinner"


export default function DatasetList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [radiobutton, setRadiobutton] = useState(true);
  const [loading, setLoading] = useState(false);
  const datasetList = useSelector(state=>state.getDatasetList.data);
  const apiLoading = useSelector(state => state.apiStatus.loading);

  const getDashboardprojectData = () => {
      const projectObj = new GetDatasetsAPI();
      dispatch(APITransport(projectObj));  
  }

  useEffect(() => {
      getDashboardprojectData();
  }, []);


  const handleProjectlist = () => {
    setRadiobutton(true)

  }
  const handleProjectcard = () => {
    setRadiobutton(false)
  }
  const handleCreateProject =(e)=>{
    navigate(`/create-Dataset-Instance-Button/`)
}
useEffect(() => {
  setLoading(apiLoading);
}, [apiLoading])
  return (
    <>
     {loading && <Spinner />}
      <FormControl>

        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue="DatasetList"
        >
          <FormControlLabel value="DatasetList" control={<Radio />} label="DatasetList" onClick={handleProjectlist} />
          <FormControlLabel value="DatasetCard" control={<Radio />} label="DatasetCard" onClick={handleProjectcard} />

        </RadioGroup>
      </FormControl>
      <Box >
      <CustomButton  sx={{  p: 2, borderRadius: 3, mt: 5, mb: 2, justifyContent: "flex-end" }} 
            onClick={handleCreateProject} label="Create New Dataset Instance" />
        <Box sx={{ p: 1 }}>
          {radiobutton ? <DatasetCardList datasetList={datasetList}/> : <DatasetCard datasetList={datasetList}/>}
        </Box>
      </Box>
    </>
  );
}