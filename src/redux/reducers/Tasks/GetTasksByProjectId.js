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
            data.results = getUniqueListBy([...prevResult,...currentResult],'id')
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
