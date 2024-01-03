import constants from "../../constants";

let initialState = {
  data: [],
};

const diffAnnotationReview = (payload) => {
  const respObjKeys = Object.keys(payload);
  const returnData = respObjKeys?.map((objName) => {
    return payload[objName]?.map(value => {
      return {
        projectType:(objName),
        languages: (value?.language),
        annotation_cumulative_word_count: (value?.ann_cumulative_word_count),
        review_cumulative_word_count: (value?.rew_cumulative_word_count),
        diff_annotation_review: (value?.ann_cumulative_word_count - value?.rew_cumulative_word_count),

        annotation_cumulative_sentance_count: (value?.total_ann_sentance_count),
        review_cumulative_sentance_count: (value?.total_rev_sentance_count),
        diff_annotation_review_sentance_count: (value?.total_ann_sentance_count - value?.total_rev_sentance_count),

        annotation_audio_word_count: (value?.ann_audio_word_count),
        review_audio_word_count: (value?.rev_audio_word_count),
        diff_annotation_review_audio_word: (value?.ann_audio_word_count - value?.rev_audio_word_count),

        annotation_raw_aud_duration:(value?.ann_raw_aud_duration),
        review_raw_aud_duration:(value?.rew_raw_aud_duration),
        annotation_raw_aud_duration_tohour:(value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        review_raw_aud_duration_tohour:(value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        diff_annotation_review_raw_aud_duration_tohour:(value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600 - value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600),

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
    case constants.WS_META_ANALYTICS:
      const data = diffAnnotationReview(action.payload);
      return { ...state, data };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
