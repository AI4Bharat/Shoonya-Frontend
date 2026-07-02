import constants from "../../constants";

const initialState = { data: 0 };

function downloadFile(content, exportType) {
  const filename = `sample_dataset.${exportType}`;

  if (exportType === "json") {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(content))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = filename;
    link.click();
    return;
  }

  const blob = new Blob(["\ufeff", content]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const SAMPLE_DOWNLOAD_CONSTANTS = {
  [constants.GET_SAMPLE_DATASET_DOWNLOAD_CSV]: "csv",
  [constants.GET_SAMPLE_DATASET_DOWNLOAD_TSV]: "tsv",
  [constants.GET_SAMPLE_DATASET_DOWNLOAD_JSON]: "json",
};

const reducer = (state = initialState, action) => {
  const exportType = SAMPLE_DOWNLOAD_CONSTANTS[action.type];

  if (exportType) {
    downloadFile(action.payload, exportType);
    return { ...state, data: state.data + 1 };
  }

  return { ...state };
};

export default reducer;
