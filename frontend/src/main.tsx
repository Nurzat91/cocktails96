import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { persistor, store } from './app/store';
import theme from './theme';
import App from './App';
import { addInterceptors } from './axiosApi';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants';

addInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App/>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </GoogleOAuthProvider>
  </Provider>
);
