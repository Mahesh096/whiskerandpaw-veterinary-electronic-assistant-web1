import * as React from 'react';

//styles
import './index.less';
import PropTypes from 'prop-types';

const CardTitle = (props) => (
  <span className="card-title">{props.children}</span>
);

export default CardTitle;

CardTitle.propTypes = {
  children: PropTypes.string.isRequired,
};
