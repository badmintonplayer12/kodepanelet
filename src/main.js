import { createApp } from './app/createApp.js';
import { registerServiceWorker } from './pwa/registerServiceWorker.js';

const appRoot = document.querySelector('#app');

createApp(appRoot).start();
registerServiceWorker();
