import { StrictMode } from 'react'
import "./assets/main.css";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { PersistGate } from "redux-persist/integration/react";
import {Provider } from "react-redux" 
import { persister, store } from './redux/store.js';
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
