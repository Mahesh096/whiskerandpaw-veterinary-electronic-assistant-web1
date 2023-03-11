// react libraries
import React, { useContext } from 'react';

// components
import { AppStateContext } from 'AppContext';

// third-party libraries
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const NonProtectedRoute = ({ component: Component, ...rest }) => {
  const auth = useContext(AppStateContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        !auth.isAuthenticated ? <Component {...props} /> : <Redirect to="/d" />
      }
    />
  );
};

NonProtectedRoute.propTypes = {
  component: PropTypes.func,
};

export default NonProtectedRoute;
