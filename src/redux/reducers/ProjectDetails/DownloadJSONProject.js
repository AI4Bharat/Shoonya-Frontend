
import constants from "../../constants";

const initialState = {
	data: 0,
};

 function jsonDownload(data) {
	console.log("JSON data", data);

	// const JSONData = JSON.stringify(data);

	const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
		JSON.stringify(data)
	  )}`;
	  const link = document.createElement("a");
	  link.href = jsonString;
	  link.download = "data.json";
	  link.click();
	  
	// 	const fileName = "my-file";
//   const json = JSON.stringify(content, null, 2);
//   console.log(json,"json")
//   const blob = new Blob([json], { type: "application/json" });
//   const href = URL.createObjectURL(blob);

//   // create "a" HTLM element with href to file
//   const link = document.createElement("a");
//   link.href = href;
//   link.download = fileName + ".json";
//   document.body.appendChild(link);
//   link.click();

//   // clean up "a" element & remove ObjectURL
//   document.body.removeChild(link);
//   URL.revokeObjectURL(href);


//   const downloadLink = document.createElement("a");
//   const blob = new Blob([content], { type: "application/json" });
// 	const url = URL.createObjectURL(blob);
// 	downloadLink.href = url;
// 	downloadLink.download = "data.json";
// 	document.body.appendChild(downloadLink);
// 	downloadLink.click();
// 	document.body.removeChild(downloadLink);

	// let filename = "export.json";
    // let contentType = "application/json;charset=utf-8;";
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(content)))], { type: contentType });
    //   navigator.msSaveOrOpenBlob(blob, filename);
    // } else {
    //   var a = document.createElement('a');
    //   a.download = filename;
    //   a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(content));
    //   a.target = '_blank';
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // }

	// const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
	// 	JSON.stringify(content)
	//   )}`;
	//   const link = document.createElement("a");
	//   link.href = jsonString;
	//   link.download = "data.json";
  
	//   link.click();

	// console.log(content,"content")
	// let ab = JSON.stringify(content);
	// const a = document.createElement("a");
	// const file = new Blob([ab], { type: "text/json" });
	// console.log(file,"file",ab,"ab")
	// a.href = URL.createObjectURL(file);
	// a.download = "yourfile.json";
	// a.click();

	

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
// const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
// 	JSON.stringify(data)
//   )}`;
//   const link = document.createElement("a");
//   link.href = jsonString;
//   link.download = "data.json";

//   link.click();

