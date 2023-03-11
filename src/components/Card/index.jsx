// react libraries
import React from 'react';

// third-party libraries
import { Card as CustomCard } from 'antd';
import PropTypes from 'prop-types';

// styles
import './index.less';

const Card = ({ children, ...rest }) => {
  return (
    <CustomCard className="custom-card" bordered={false} {...rest}>
      {children}
    </CustomCard>
  );
};

Card.propTypes = {
  children: PropTypes.element,
};

export default Card;
