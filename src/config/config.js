const configs = {
    BASE_URL: "http://20.51.211.111:8000/",
    BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL
      ? process.env.REACT_APP_APIGW_BASE_URL
        :"http://backend.stage.shoonya.ai4bharat.org",
      //  :"http://20.51.211.111:8000"
  };
  
  export default configs;
