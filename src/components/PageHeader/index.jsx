// react libraries
import React from 'react';

// third-party libraries
import { PageHeader as CustomPageHeader } from 'antd';
import PropTypes from 'prop-types';

// styles
import './index.less';

const PageHeader = ({ title, subTitle, onBack }) => {
  return (
    <CustomPageHeader
      className="custom-page-header"
      title={title}
      subTitle={subTitle}
      onBack={onBack}
    />
  );
};

PageHeader.defaultProps = {
  subTitle: '',
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  onBack: PropTypes.func,
};

export default PageHeader;
