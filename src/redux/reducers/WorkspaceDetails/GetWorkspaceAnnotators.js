import constants from "../../constants";

let initialState = {
  data: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.GET_WORKSPACE_ANNOTATORS_DATA:
      console.log(action.payload, "GET_WORKSPACE_ANNOTATORS_DATA");
      return {
        ...state,
        data: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
