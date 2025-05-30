import C from "../../constants";

let initialState = {
  data: [],
  originalData: [],

};

const diffAnnotationReview = (payload) => {
  const respObjKeys = Object.keys(payload);
  const returnData = respObjKeys?.map((objName) => {
    return payload[objName]?.map(value => {
      return {
        projectType:(objName),
        languages: (value?.language),
        annotation_cumulative_tasks_count: (value?.ann_cumulative_tasks_count),
        review_cumulative_tasks_count: (value?.rew_cumulative_tasks_count),
        sup_cumulative_tasks_count : (value?.sup_cumulative_tasks_count),
        diff_annotation_rev_sup: (value?.ann_cumulative_tasks_count - value?.rew_cumulative_tasks_count-value?.sup_cumulative_tasks_count),
        diff_annotation_rev: (value?.ann_cumulative_tasks_count - value?.rew_cumulative_tasks_count),
        diff_annotation_sup: (value?.ann_cumulative_tasks_count - value?.sup_cumulative_tasks_count),
        diff_rev:(value?.rew_cumulative_tasks_count-value?.sup_cumulative_tasks_count),
      };
    })
  })

  return returnData;



};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.FETCH_TASK_ANALYTICS_DATA:
      const data = diffAnnotationReview(action.payload);
      return { ...state, originalData: action.payload, data };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
