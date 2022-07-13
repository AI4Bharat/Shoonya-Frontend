import constants from "../../constants"

export default function SetTaskFilter(id, filters, type = "annotation") {
    return {
        type: constants.SET_TASK_FILTER,
        payload: {
            id,
            filters,
            type
        }
    }
}