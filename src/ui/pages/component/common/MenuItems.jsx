import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function MenuItems(props) {
  const [selectmenu, setselectmen] = React.useState('');

  const handleChange = (event) => {
    props.handleChange(event.target.value)
    console.log(event.target.value)
    setselectmen(event.target.value);
  };
console.log(props,"asdfghhjj")
  return (
    <div>
      <FormControl fullWidth variant="standard" sx={{ m: 1, minWidth: 120 }}>
        {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel> */}
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={props.value}
          onChange={handleChange}
        //   label="Age"
        >
           { 
            props.menuOptions.map(menu  => {
                    return  <MenuItem  key={menu.name} value={menu.value}> {menu.name}</MenuItem>
                })
            }
        </Select>
      </FormControl>
     
    </div>
  );
}
