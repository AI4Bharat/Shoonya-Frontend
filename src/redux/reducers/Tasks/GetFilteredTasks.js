// import { getUniqueListBy } from "../../../utils/utils";
import constants from "../../constants";

let initialState = {
  data: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.FILTER_TASKS:
      // let initialTasks = action.payload.initialTasks;
      // let filters = action.payload.filters;
      let { initialTasks, filters } = action.payload;
let data = initialTasks.filter((task) => {
  for (let key in filters) {
    const filterVal = filters[key];
    if (filterVal === "" || filterVal === null || filterVal === undefined || filterVal === -1) continue;
    if (Array.isArray(filterVal)) {
      if (!filterVal.includes(task[key])) return false;
    } else {
      if (task[key] !== filterVal) return false;
    }
  }
  return true;
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
