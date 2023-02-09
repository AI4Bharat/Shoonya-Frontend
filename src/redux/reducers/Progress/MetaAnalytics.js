import C from "../../constants";

let initialState = {
  data: [],
};




const diffAnnotationReview = (payload) => {
    console.log(payload,"payloadpayload")
   
  const respObjKeys = Object.keys(payload);
  const returnData = respObjKeys?.map((objName) => {
    return payload[objName]?.map(value => {
      return {
        projectType:(objName),
        languages: (value?.language),
        annotation_cumulative_word_count: (value?.ann_cumulative_word_count),
        review_cumulative_word_count: (value?.rew_cumulative_word_count),
        diff_annotation_review: (value?.ann_cumulative_word_count - value?.rew_cumulative_word_count),
        annotation_aud_duration:(value?.ann_cumulative_aud_duration),
        review_aud_duration:(value?.rew_cumulative_aud_duration),
        annotation_aud_duration_tohour:(value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        review_aud_duration_tohour:(value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        diff_annotation_review_aud_duration_tohour:(value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600 - value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600)
      };
    })
    
  })

  return returnData;

 

};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.FETCH_META_ANALYTICS_DATA:
      const data = diffAnnotationReview(action.payload);
      return { ...state, data };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

