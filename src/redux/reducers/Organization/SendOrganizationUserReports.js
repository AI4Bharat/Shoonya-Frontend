import constants from "../../constants";

let initialState = {
    data: []
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.SEND_ORGANIZATION_USER_REPORTS:
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
