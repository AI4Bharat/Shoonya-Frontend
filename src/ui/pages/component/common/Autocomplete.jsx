import React ,{useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Autocompletes(props) {
    console.log(props,"aaaaaaaaaaa")
    const [selectAutocomplete, setselectAutocomplete] = React.useState("");

    useEffect(() => {
      setselectAutocomplete(props.value)
    }, [])
  
  return (
    <Autocomplete
      // freeSolo
      // disablePortal
      id="combo-box-demo"
      value={selectAutocomplete}
      options={props.options}
      getOptionLabel={(option) => (option ? option : "")}
      onChange={props.onChange}
      name={props.name}
      sx={{ width: 500 }}
      renderInput={(params) => <TextField {...params} label={props.label} inputProps={{ ...params.inputProps, style: { fontSize: "14px" } }}  />}
    />
  );
}
