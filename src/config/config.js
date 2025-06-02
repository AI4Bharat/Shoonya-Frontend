const configs = {
  BASE_URL: "https://backend.prod2.shoonya.ai4bharat.org",
  BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL
    ? process.env.REACT_APP_APIGW_BASE_URL
        :"http://127.0.0.1:8000"
};

export default configs;
//http://20.51.211.111:8000
//https://backend.shoonya.ai4bharat.org/
// https://backend.dev2.shoonya.ai4bharat.org
//https://backend.prod2.shoonya.ai4bharat.org
// "http://127.0.0.1:8000"
// https://backend.dev.shoonya.ai4bharat.org