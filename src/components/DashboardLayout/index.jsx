// react libraries
import React from 'react';
import { Route, Switch } from 'react-router';

// third-party libraries
import { Layout } from 'antd';

// components
import Vet from 'pages/Vet';
import Roles from 'pages/Roles';
import Hospital from 'pages/Hospital';
import Sidebar from './_partials/Sidebar';
import Welcome from 'pages/Welcome';
import ProtectedRoute from 'components/ProtectedRoute';
import PetProfiles from 'pages/PetProfiles';
import KnowledgeBase from 'pages/KnowledgeBase';
import Permissions from 'pages/Permissions';
import Profile from 'pages/PetProfiles/_partials/Profile';
import HospitalSetting from 'pages/Hospital/_partials/HospitalSetting';
import ClientInformation from 'pages/ClientInformation';
import Configurations from 'pages/Configurations';

//utils
import routePaths from 'utils/routePaths';

// third-party components
const { Content, Footer } = Layout;

// styles
import './index.less';

const DashboardLayout = () => {
  return (
    <div id="dashboard-layout">
      <Layout>
        <Sidebar />
        <Layout className="site-base-layout">
          <Content
            className="base-content-container"
            style={{ margin: '24px 24px 0' }}
          >
            <div className="site-layout-background">
              <Switch></Switch>
              <ProtectedRoute
                path={routePaths.clinics}
                exact
                component={Hospital}
              />
              <ProtectedRoute
                path={routePaths.welcome}
                exact
                component={Welcome}
              />
              <ProtectedRoute
                path={`${routePaths.knowledgeBase}/:tab?`}
                component={KnowledgeBase}
              />
              <Route path={routePaths.users} exact component={Vet} />
              <Route path={routePaths.roles} exact component={Roles} />
              <Route
                path={routePaths.permissions}
                exact
                component={Permissions}
              />
              <Route
                path={routePaths.petProfiles}
                exact
                component={PetProfiles}
              />
              <Route
                path={`${routePaths.petProfiles}/pet/:petId`}
                component={Profile}
              />
              <Route
                path={`${routePaths.hospitalSetting}`}
                exact
                component={HospitalSetting}
              />
              <Route
                path={`${routePaths.petParents}`}
                exact
                component={ClientInformation}
              />
              <Route
                path={`${routePaths.configurations}`}
                exact
                component={Configurations}
              />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Whisker + Paw ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default DashboardLayout;
