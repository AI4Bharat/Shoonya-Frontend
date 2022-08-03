import { getUniqueListBy, isValidUrl } from "../../../utils/utils";
import constants from "../../constants";

let initialState = {
    data:[],
    endpoint: ""
}
const reducer = (state=initialState,action)=>{
    switch(action.type){
        case constants.GET_TASK_LIST:
            /* let data = action.payload;
            if (isValidUrl(state.endpoint) && isValidUrl(action.endpoint)) {
                let oldURLParam = new URL(state.endpoint).searchParams;
                let newURLParam = new URL(action.endpoint).searchParams;
                let flag = true;
                for(let param of newURLParam.keys()){
                    if (param !== "page" && newURLParam.get(param) !== oldURLParam.get(param)) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    for (let param of oldURLParam.keys()) {
                        if (param !== "page" && oldURLParam.get(param) !== newURLParam.get(param)) {
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag) {
                    const prevResult = state.data.hasOwnProperty('results')?state.data.results:[];
                    const currentResult = action.payload.results;
                    data.results = getUniqueListBy([...prevResult,...currentResult],'id')
                }
            } */
            return {
                ...state,
                data: action.payload,
                endpoint:action.endpoint
            } 

        default:
            return {
                ...state
            }
    }

};

export default reducer;
