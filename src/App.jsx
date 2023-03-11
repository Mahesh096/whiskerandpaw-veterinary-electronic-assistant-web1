// react libraries
import React, { useState, useEffect } from 'react';

// components
import Signin from 'pages/Signin';
import Signup from 'pages/Signup';
import SetPassword from 'pages/SetPassword';
import DashboardLayout from 'components/DashboardLayout';
import { AppStateProvider } from './AppContext';
import ProtectedRoute from 'components/ProtectedRoute';
import NonProtectedRoute from 'components/NonProtectedRoute';

// third-party libraries
import jwt_decode from 'jwt-decode';
import QueryClient from 'query-config';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';

// utils
import setAuthToken from 'utils/setAuthToken';

// styles
import './App.less';
import CheckApproval
  from './pages/PetProfiles/_partials/Profile/_partials/SOAPModal/_partials/ApprovalPage/CkeckApproval';

// Check for token
let userAuthDetails = localStorage.getItem('whiskerUserDetails');
userAuthDetails = JSON.parse(userAuthDetails || '0');

if (userAuthDetails) {
  // Set auth token header auth

  const { token } = userAuthDetails;
  setAuthToken(token);

  window.WHISKER_PAW_LOGGED_IN_USER = userAuthDetails;

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  const currentTime = Date.now() / 1000;

  // Check for token expiration
  if (decoded.exp < currentTime) {
    // Logout user
    window.WHISKER_PAW_LOGGED_IN_USER = false;
  }
}

function App() {
  const [appState, setAppState] = useState({
    isAuthenticated: window.WHISKER_PAW_LOGGED_IN_USER && true,
    user:
      (window.WHISKER_PAW_LOGGED_IN_USER &&
        window.WHISKER_PAW_LOGGED_IN_USER.user) ||
      undefined,
    token:
      (window.WHISKER_PAW_LOGGED_IN_USER &&
        window.WHISKER_PAW_LOGGED_IN_USER.token) ||
      undefined,
    refreshToken:
      (window.WHISKER_PAW_LOGGED_IN_USER &&
        window.WHISKER_PAW_LOGGED_IN_USER.refreshToken) ||
      undefined,
    clinics:
      (window.WHISKER_PAW_LOGGED_IN_USER &&
        window.WHISKER_PAW_LOGGED_IN_USER.clinics) ||
      undefined,
    activeClinic:
      window.WHISKER_PAW_LOGGED_IN_USER &&
      window.WHISKER_PAW_LOGGED_IN_USER.clinics &&
      window.WHISKER_PAW_LOGGED_IN_USER.clinics.length
        ? window.WHISKER_PAW_LOGGED_IN_USER.clinics[0]
        : undefined,
  });

  useEffect(() => {
    if (!appState.isAuthenticated) handleSignOutUser();
  }, []);

  const handleSignOutUser = () => {
    // remove auth token
    setAuthToken(false);

    // remove user details from browser
    localStorage.removeItem('whiskerUserDetails');

    setAppState({ isAuthenticated: false });

    window.WHISKER_PAW_LOGGED_IN_USER = false;
  };

  return (
    <div className='App'>
      <AppStateProvider
        appState={appState}
        setAppState={setAppState}
        handleSignOutUser={handleSignOutUser}
        checkIfUserIsLoggedIn={appState.isAuthenticated || false}
      >
        <QueryClientProvider client={QueryClient}>
          <Router>
            <ProtectedRoute path='/d' component={DashboardLayout} />
            <NonProtectedRoute path='/' exact component={Signin} />
            <NonProtectedRoute path='/signup' exact component={Signup} />
            <NonProtectedRoute
              path='/new-password/:id'
              exact
              component={SetPassword}
            />
            <NonProtectedRoute
              path='/new-password/user/:id'
              exact
              component={SetPassword}
            />
            <NonProtectedRoute
              path='/approval-process/user/:id'
              component={CheckApproval}
            />
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AppStateProvider>
    </div>
  );
}

export default App;
