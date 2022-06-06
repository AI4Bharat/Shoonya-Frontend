import constants from "../../constants";

const reducer = (state,action)=>{
    switch(action.type){
        case constants.GET_PROJECT_DATA:
            return {...action.payload} 

        default:
            return {
                ...state
            }
    }

};

export default reducer;
