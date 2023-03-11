// react libraries
import React, { createContext } from 'react';

// third-party libraries
import PropTypes from 'prop-types';

const AppStateContext = createContext(undefined);
const AppStateDispatchContext = createContext(undefined);

const AppStateProvider = ({
  children,
  appState,
  setAppState,
  handleSignOutUser,
  checkIfUserIsLoggedIn,
}) => {
  return (
    <AppStateContext.Provider value={appState}>
      <AppStateDispatchContext.Provider
        value={{ setAppState, handleSignOutUser, checkIfUserIsLoggedIn }}
      >
        {children}
      </AppStateDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

AppStateProvider.propTypes = {
  children: PropTypes.element,
  appState: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired,
  handleSignOutUser: PropTypes.func.isRequired,
  checkIfUserIsLoggedIn: PropTypes.bool.isRequired,
};

export { AppStateProvider, AppStateContext, AppStateDispatchContext };
