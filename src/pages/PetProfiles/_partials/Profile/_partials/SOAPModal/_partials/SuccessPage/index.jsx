import React from 'react';

//third-party libraries
import { Typography, Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

//styles
import './index.less';

const { Title } = Typography;

const SuccessPage = ({ onClose }) => {
  const history = useHistory();

  const handleDoneClick = () => {
    onClose();
    history.push({ search: '' });
  };

  return (
    <div id="soap-success-page">
      <div className="image-container">
        <img src={'/img/girl-and-dog.png'} alt="" />
      </div>
      <div>
        <Title level={3}>The SOAP process has been completed</Title>

        <p>
          An email would be sent to the client containing the treatment/visit
          summary
        </p>

        <div>
          <Row justify="center" style={{ marginTop: 30 }}>
            <Col>
              <Button
                type="primary"
                size="large"
                shape="round"
                onClick={handleDoneClick}
              >
                Done
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
SuccessPage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SuccessPage;
