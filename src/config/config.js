const configs = {
    BASE_URL: "https://backend.prod2.shoonya.ai4bharat.org",
    BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL
      ? process.env.REACT_APP_APIGW_BASE_URL
        :"https://backend.shoonya.ai4bharat.org"
  };
  
  export default configs;