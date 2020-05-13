import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';

// setting for axios
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.headers.post['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept";
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = "http://localhost:3000";
axios.defaults.withCredentials = true;

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
