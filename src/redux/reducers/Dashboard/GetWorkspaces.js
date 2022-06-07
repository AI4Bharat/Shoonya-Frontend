import constants from "../../constants";

let initialState = {
    data:[]
}
const reducer = (state=initialState,action)=>{
    switch(action.type){
        case constants.GET_WORKSPACES_DATA:
            return {
                ...state,
                data:action.payload.results
            } 

        default:
            return {
                ...state
            }
    }

};

export default reducer;
