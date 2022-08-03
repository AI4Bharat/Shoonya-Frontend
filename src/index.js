import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './web.route';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material';
import themeDefault from './ui/theme/theme';
import {Provider} from 'react-redux';
import store from './redux/store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <ThemeProvider theme={themeDefault}>
      <App />
    </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
