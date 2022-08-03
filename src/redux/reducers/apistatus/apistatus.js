import constants from "../../constants";

const apistatus = (state = 0 , action) => {
    switch (action.type) {
        case constants.APISTATUS:
            return action.payload;
        default:
            return state;
    }
}

export default apistatus;
