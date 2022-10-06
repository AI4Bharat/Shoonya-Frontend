import { InputBase,ThemeProvider,Grid } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from "react";
import themeDefault from '../../../theme/theme'
 import DatasetStyle from "../../../styles/Dataset";
 import { useDispatch, useSelector } from "react-redux";
 import SearchProjectCards from "../../../../redux/actions/api/ProjectDetails/SearchProjectCards"

const Search = (props) => {
  const ref = useRef(null);
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  
  const SearchProject = useSelector((state) => state.SearchProjectCards.data);
  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {
    if (ref) ref.current.focus();
  }, [ref]);

  useEffect(() => {
   
    dispatch(SearchProjectCards(""));
}, [])

  const handleChangeName = (value) => {
    setSearchValue(value);
    dispatch(SearchProjectCards(value));
  };
 

  return (
   <Grid container justifyContent="end" sx={{marginTop:"20px"}}>
                <Grid   className={classes.search}>
                    <Grid className={classes.searchIcon}>
                        <SearchIcon fontSize="small" />
                    </Grid>
                    <InputBase
                        sx={{ ml: 4 }}
                        inputRef={ref}
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => handleChangeName(e.target.value)}

                        inputProps={{ "aria-label": "search" }}
                        
                    />
                </Grid>
                </Grid>
          
  );
};

export default Search;