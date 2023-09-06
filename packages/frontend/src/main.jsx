import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import { BrowserRouter as Router } from "react-router-dom";
import { Amplify } from "aws-amplify";
import config from "./config.js";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "pictures",
        endpoint: config.apiGateway.PICTURES_URL,
        region: config.apiGateway.REGION,
      },
      {
        name: "categories",
        endpoint: config.apiGateway.CATEGORIES_URL,
        region: config.apiGateway.REGION,
      },
      {
        name: "associations",
        endpoint: config.apiGateway.ASSOCIATIONS_URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
