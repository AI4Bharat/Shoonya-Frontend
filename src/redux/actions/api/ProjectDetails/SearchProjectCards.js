import constants from "../../../constants";

const action = (searchValue) => {
   
  return {
    type: constants.SEARCH_PROJECT_CARDS,
    payload: searchValue
  };
};

export default action;



