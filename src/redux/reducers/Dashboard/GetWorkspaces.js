import { getUniqueListBy } from "../../../utils/utils";
import constants from "../../constants";

let initialState = {
    data:[]
}
const reducer = (state=initialState,action)=>{
    switch(action.type){
        case constants.GET_WORKSPACES_DATA:
            let data = action.payload;
            const prevResult = state.data.hasOwnProperty('results')?state.data.results:[];
            const currentResult = action.payload.results;
            data.results = getUniqueListBy([...prevResult,...currentResult],'id')
            return {
                ...state,
                data:action.payload
            } 

        default:
            return {
                ...state
            }
    }

};

export default reducer;
