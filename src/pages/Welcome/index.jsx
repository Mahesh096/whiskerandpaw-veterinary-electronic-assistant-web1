// react libraries
import React, { useContext, useState } from 'react';

// third-party libraries
import { Row, Col } from 'antd';

// components
import UsersSVG from 'svg/users.svg';
import WelcomeSVG from 'svg/welcome.svg';
import { AppStateContext } from 'AppContext';
import ActionCard from 'components/ActionCard';
import InviteUser from 'pages/Vet/_partials/InviteUser';

// styles
import './index.less';

const Welcome = () => {
  const { user } = useContext(AppStateContext);

  const [showInviteUserModal, setShowInviteUserModal] = useState(false);

  const toggleInviteUserModal = () => {
    setShowInviteUserModal((prvState) => !prvState);
  };

  return (
    <div id="welcome-page">
      <Row gutter={[20, 40]} justify="space-between">
        <Col sm={24} md={13}>
          <div className="greeting-container">
            <p>
              Hello <span className="username">{user.fullName}</span> 👋
            </p>
          </div>

          <div className="welcome-message-container">
            <h2 className="title">
              Welcome to Whisker & Paw Veterinary Electronic Assistant (VEA)
              Hub!
            </h2>
            <p className="message">
              Thanks for completing the initial registration. Before you can
              become a smart clinic, you must complete the task below:
            </p>
          </div>
        </Col>
        <Col sm={24} md={6} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="illustration-container">
            <img src={WelcomeSVG} alt="" />
          </div>
        </Col>
      </Row>

      <Row gutter={[25, 20]}>
        <Col sm={24} md={8}>
          <ActionCard
            icon={UsersSVG}
            description="Complete your pack by adding some team members. You need at
                least one Veterinarian to begin using VEA."
            onClick={toggleInviteUserModal}
            title="Invite Users"
          />
        </Col>
        <Col sm={24} md={8}>
          <ActionCard
            icon={UsersSVG}
            description="In order to use VEA, you must add your payment details and TAX
            information."
            onClick={() => {}}
            title="Add Payment & Business Details"
          />
        </Col>

        {showInviteUserModal && (
          <InviteUser
            visible={showInviteUserModal}
            onCancel={toggleInviteUserModal}
            onCreateButtonClick={() => {}}
          />
        )}
      </Row>
    </div>
  );
};

export default Welcome;
