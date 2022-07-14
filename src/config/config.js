const configs = {
    BASE_URL: "https://backend.shoonya.ai4bharat.org",
    BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL
      ? process.env.REACT_APP_APIGW_BASE_URL
        :"http://20.51.211.111:8000"
  };
  
  export default configs;

