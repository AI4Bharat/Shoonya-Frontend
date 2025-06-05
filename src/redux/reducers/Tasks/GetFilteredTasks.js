// import { getUniqueListBy } from "../../../utils/utils";
import constants from "../../constants";

let initialState = {
  data: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.FILTER_TASKS:
      let { initialTasks, filters } = action.payload;
      let data = initialTasks.filter((task) => {
        let isValid = true;
        for (let key in filters) {
          if (filters[key] !== "") {
            if (task[key] !== filters[key]) {
              isValid = false;
            }
          }
        }
        return isValid;
      });
      return {
        ...state,
        data: data,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
