import constants from "../../constants"

export default function filterTasks(initialTasks, filters) {
    return {
        type: constants.FILTER_TASKS,
        payload: {
            initialTasks,
            filters
        }
    }
}