
import { useState } from 'react'
import {Radio,Box} from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import DatasetList from "../Dataset/DatasetList";
import DatasetCard from "../Dataset/DatasetCard";


export default function DatasetCardList() {
    const [radiobutton, setRadiobutton] = useState(true)
   
    
   const  handleProjectlist =()=>{
    setRadiobutton(true)
    
   }
    const handleProjectcard = () =>{
        setRadiobutton(false)
    }
  return (
    <>
    <FormControl>
    
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue="DatasetList"
      >
        <FormControlLabel value = "DatasetList" control={<Radio />} label="DatasetList" onClick={handleProjectlist} />
        <FormControlLabel value = "DatasetCard" control={<Radio />} label="DatasetCard" onClick={handleProjectcard} />
       
      </RadioGroup>
    </FormControl>
    <Box >
              
                 <Box sx={{ p: 1 }}>
                 {radiobutton ? <DatasetList /> : <DatasetCard />}    
               </Box>
            </Box>
            </>
  );
}
