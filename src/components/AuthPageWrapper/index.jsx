// react libraries
import React from 'react';

// third-party components
import PropTypes from 'prop-types';

// components
import AppLogoSVG from 'imgs/app-logo.svg';

// styles
import './index.less';

const AuthPageWrapper = ({ children, formTitle, className }) => {
  return (
    <div id={`auth-page-wrapper`} className={className}>
      <div className="auth-container">
        <div className="form-wrapper">
          <div className="logo-container">
            <img src={AppLogoSVG} alt="" />
          </div>
          <h1 className="form-title">{formTitle}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

AuthPageWrapper.propTypes = {
  children: PropTypes.element,
  formTitle: PropTypes.string,
  className: PropTypes.string,
};

export default AuthPageWrapper;
