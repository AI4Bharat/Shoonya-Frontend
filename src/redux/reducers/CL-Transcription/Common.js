import C from "../../constants";

const initialState = {
  player: null,
  subtitles: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
   
    case C.PLAYER: {
      let result = state;
      result.player = action.payload;
      return result;
    }

    case C.SUBTITLES: {
      let result = state;
      result.subtitles = action.payload;
      return result;
    }

    
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
