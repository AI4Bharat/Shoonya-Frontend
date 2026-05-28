import constants from "../../constants";

/**
 * SetTaskFilter
 *
 * NOTE:
 * This function is generic and already supports dynamic filters.
 * No internal changes are required for new filters like:
 * - language
 * - status
 * - domain
 *
 * Usage (at dispatch call-site):
 *
 * dispatch(SetTaskFilter(projectId, {
 *   ...currentFilters,   // preserves existing filters
 *   language: "en",
 *   status: "completed",
 *   domain: "medical",
 * }, type));
 */

export default function SetTaskFilter(id, filters, type = "annotation") {
    return {
        type: constants.SET_TASK_FILTER,
        payload: {
            id,
            filters,
            type
        }
    };
}