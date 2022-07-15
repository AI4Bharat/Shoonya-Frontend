
import constants from "../../constants";

const initialState = {
	data: 0,
};

 function jsonDownload(data) {
	const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
		JSON.stringify(data)
	  )}`;
	  const link = document.createElement("a");
	  link.href = jsonString;
	  link.download = "data.json";
	  link.click();	

}



const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.DOWNLOAD_PROJECT_JSON:
			jsonDownload(action.payload);
			return {
				...state,
				data: state.data + 1,
			};

		default:
			return {
				...state,
			};
	}
};

export default reducer;


