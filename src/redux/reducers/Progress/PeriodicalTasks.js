import constants from "../../constants";

let initialState = {
  data: [],
};

function PeriodicalListData (data){
console.log(data,"data1234")



}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.PERODICAL_TASK_DATA:
      PeriodicalListData(action.payload);
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
