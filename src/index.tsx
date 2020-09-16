import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { isPlatform } from '@ionic/react';

if(isPlatform('electron'))
{
  const ipcRenderer = window.require('electron').ipcRenderer;
  ipcRenderer.on('console', (event, type, ...args) => {
      console[type](...args);
  });
}

ReactDOM.render(<App />, document.getElementById('root'));

const style = document.createElement('link');
style.href = "https://fonts.googleapis.com/css2?family=Inria+Sans:ital,wght@0,400;0,700;1,400&family=Philosopher:wght@700&display=swap";
style.rel = "stylesheet"
document.head.appendChild(style);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
