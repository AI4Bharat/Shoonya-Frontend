import constants from "../../constants";

const initialState = {
    data: 0,
};

function downloadCSV(content) {
    const downloadLink = document.createElement("a");
    const blob = new Blob(["\ufeff", content]);
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "sample_dataset.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.GET_SAMPLE_DATASET_DOWNLOAD_CSV:
            downloadCSV(action.payload);
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
