import React from 'react';
import { Row, Col } from 'antd';
import ActionCard from 'components/ActionCard';
import SettingSVG from 'svg/setting_svg.svg';
import routePaths from 'utils/routePaths';

const Configurations = () => {
  return (
    <div id="configurations">
      <div>
        <Row gutter={[25, 30]}>
          <Col sm={24} md={8} lg={6}>
            <ActionCard
              icon={SettingSVG}
              description="Complete your pack by adding some team members. You need at
                least one Veterinarian to begin using VEA."
              type="link"
              url={routePaths.hospitalSetting}
              title="Hospital Settings"
            />
          </Col>
          <Col sm={24} md={8} lg={6}>
            <ActionCard
              icon={SettingSVG}
              description="In order to use VEA, you must add your payment details and TAX
            information."
              onClick={() => {}}
              title="Setup Permissions"
              type="link"
              url={routePaths.permissions}
            />
          </Col>
          <Col sm={24} md={8} lg={6}>
            <ActionCard
              icon={SettingSVG}
              description="In order to use VEA, you must add your payment details and TAX
            information."
              type="link"
              url={routePaths.roles}
              title="Manage Roles"
            />
          </Col>
          <Col sm={24} md={8} lg={6}>
            <ActionCard
              icon={SettingSVG}
              description="In order to use VEA, you must add your payment details and TAX
            information."
              type="link"
              url={routePaths.users}
              title="Manage Users"
            />
          </Col>
          <Col sm={24} md={8} lg={6}>
            <ActionCard
              icon={SettingSVG}
              description="In order to use VEA, you must add your payment details and TAX
            information."
              type="link"
              url={routePaths.knowledgeBase}
              title="Manage Knowledge Base"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Configurations;
