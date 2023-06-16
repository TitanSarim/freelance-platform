import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

import {positions, transitions, Provider as AlertProvider} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import './index.css'
import { ThemeProvider } from "@material-tailwind/react";


const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT,
  transitions: transitions.FADE,
  offset: '30px',
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AlertProvider>
    </Provider>

  </React.StrictMode>
);

