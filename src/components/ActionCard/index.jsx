import React from 'react';

// third-party libraries
import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

// styles
import './index.less';

const ActionCard = ({ icon, description, title, onClick, type, url }) => {
  const history = useHistory();

  const handleLinkClick = () => {
    history.push(url);
  };

  return (
    <div
      className="action-card-container"
      onClick={type === 'link' ? handleLinkClick : onClick}
      role="button"
    >
      <div className="icon-container">
        <img src={icon} alt="" />
      </div>
      <h3 className="title">{title}</h3>
      <div className="description">
        <Typography.Paragraph ellipsis={{ rows: 4 }}>
          {description}
        </Typography.Paragraph>
      </div>
    </div>
  );
};

ActionCard.propTypes = {
  icon: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  url: PropTypes.string,
};

ActionCard.defaultProps = {
  type: 'button',
};

export default ActionCard;
