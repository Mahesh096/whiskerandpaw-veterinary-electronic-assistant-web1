// react libraries
import React from 'react';

// third-party components
import { Tabs } from 'antd';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';

// components
import Gender from './_partials/Gender';
import Breeds from './_partials/Breeds';
import Species from './_partials/Species';
import Vaccines from './_partials/Vaccines';
import Diagnosis from './_partials/Diagnosis';
import Diagnostics from './_partials/Diagnostics';
import Differentials from './_partials/Differentials';
import SoapConnection from './_partials/SoapConnection';
import MedicationsInventory from './_partials/MedicationsInventory';

// utils
import routePaths from 'utils/routePaths';

// third-part components
const { TabPane } = Tabs;

// styles
import './index.less';

const KnowledgeBase = (props) => {
  const { history } = props;

  const knowledgeBaseSubRoutes = [
    {
      Component: Vaccines,
      routeKey: 'vaccine',
      title: 'Vaccines',
    },
    {
      Component: MedicationsInventory,
      routeKey: 'medications',
      title: 'Medications',
    },
    {
      Component: Differentials,
      routeKey: 'differentials',
      title: 'Differentials',
    },
    {
      Component: Diagnosis,
      routeKey: 'diagnosis',
      title: 'Diagnosis',
    },
    {
      Component: Diagnostics,
      routeKey: 'diagnostics',
      title: 'Diagnostics',
    },
    {
      Component: SoapConnection,
      routeKey: 'soap',
      title: 'Conditions & Rules',
    },
    {
      Component: Breeds,
      routeKey: 'breeds',
      title: 'Breeds',
    },
    {
      Component: Species,
      routeKey: 'species',
      title: 'Species',
    },
    {
      Component: Gender,
      routeKey: 'gender',
      title: 'Gender',
    },
  ];

  const handleTabChange = (tabKey) => {
    history.push(`${routePaths.knowledgeBase}/${tabKey}`);
  };

  return (
    <div>
      <Switch>
        <Tabs
          className="knowledge-base-tabs"
          defaultActiveKey={history?.location?.pathname?.split('/').pop()}
          onChange={handleTabChange}
        >
          {knowledgeBaseSubRoutes.map((subRoute) => (
            <TabPane tab={subRoute.title} key={subRoute.routeKey}>
              <subRoute.Component {...props} />
            </TabPane>
          ))}
        </Tabs>
      </Switch>
    </div>
  );
};

KnowledgeBase.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default KnowledgeBase;
