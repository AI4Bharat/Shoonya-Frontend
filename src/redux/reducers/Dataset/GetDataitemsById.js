import { getUniqueListBy } from "../../../utils/utils";
import constants from "../../constants";

let initialState = {
    data:[]
}
const reducer = (state=initialState,action)=>{
    switch(action.type){
        case constants.GET_DATAITEMS_BY_ID:
            /* let data = action.payload;
            const prevResult = state.data.hasOwnProperty('results')?state.data.results:[];
            const currentResult = action.payload.results;
            if (prevResult?.length && currentResult?.length && prevResult[0]?.instance_id === currentResult[0]?.instance_id) {
                data.results = getUniqueListBy([...prevResult,...currentResult],'id')
            } */
            return {
                ...state,
                data: action.payload
            } 

        default:
            return {
                ...state
            }
    }

};

export default reducer;
