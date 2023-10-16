import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const helpText = 'test'

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <div>
      <h1>
        {helpText}
      </h1>
  </div>
);
