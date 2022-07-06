import constants from "../../constants";

const initialState = {
	data: [],
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.GET_DATASET_MEMBERS:
			return {
				...state,
				data: action.payload,
			};

		default:
			return {
				...state,
			};
	}
};

export default reducer;
