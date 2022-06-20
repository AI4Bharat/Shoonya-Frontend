import { getUniqueListBy } from "../../../utils/utils";
import constants from "../../constants";

let initialState = {
    data:[]
}
const reducer = (state=initialState,action)=>{
    switch(action.type){
        case constants.GET_TASK_LIST:
            let data = action.payload;
            const prevResult = state.data.hasOwnProperty('results')?state.data.results:[];
            const currentResult = action.payload.results;
            if (prevResult.length > 0 && currentResult.length > 0 && prevResult[0].task_status === currentResult[0].task_status) {
                data.results = getUniqueListBy([...prevResult,...currentResult],'id')
            }
            return {
                ...state,
                data
            } 

        default:
            return {
                ...state
            }
    }

};

export default reducer;
