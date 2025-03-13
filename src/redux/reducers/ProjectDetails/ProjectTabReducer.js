import { SET_TAB_VALUE } from "../../actions/Tasks/ProjectTabActions";

const initialState = {
  value: 0,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TAB_VALUE:
      return {
        ...state,
        value: action.payload,
      };
    default:
      return state;
  }
};

export default projectReducer;