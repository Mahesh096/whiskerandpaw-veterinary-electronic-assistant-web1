// react libraries
import React, { useContext } from 'react';

// third-party libraries
import { Layout, Menu, Button, Dropdown } from 'antd';
import {
  AppstoreOutlined,
  // BarChartOutlined,
  // SettingOutlined,
  // CreditCardOutlined,
  // TeamOutlined,
  QqOutlined,
  DownOutlined,
  LoginOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

// components
import AppLogoSVG from 'imgs/app-logo.svg';
import { AppStateContext, AppStateDispatchContext } from 'AppContext';
import PetIcon from 'components/PetIcon';

// styles
import './index.less';
import routePaths from 'utils/routePaths';

// third-party components
const { Sider } = Layout;

const Sidebar = () => {
  const { user, clinics, activeClinic } = useContext(AppStateContext);
  const { handleSignOutUser } = useContext(AppStateDispatchContext);

  const sideMenuItems = [
    {
      title: 'Welcome',
      route: routePaths.welcome,
      icon: <AppstoreOutlined />,
      visible: true,
    },
    // {
    //   title: 'Whiteboard',
    //   route: '/d/',
    //   icon: <AppstoreOutlined />,
    //   visible: false,
    // },
    {
      title: 'Pet Profiles',
      route: routePaths.petProfiles,
      icon: <QqOutlined />,
      visible: true,
    },
    {
      title: 'Configurations',
      route: routePaths.configurations,
      icon: <SettingOutlined />,
      visible: true,
    },
    {
      title: 'Pet Parents',
      route: routePaths.petParents,
      icon: <PetIcon /*style={{  fill: '#70C2AC'}}*/ />,
      visible: true,
    },
  ];
  const menu = (
    <Menu>
      {/* <Menu.Item>
        <a rel="noopener noreferrer">Clinic 1</a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer">Clinic 2</a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer">Clinic 3</a>
      </Menu.Item> */}

      {clinics &&
        clinics.map((clinic) => (
          <Menu.Item key={clinic.id}>
            <a rel="noopener noreferrer">{clinic.name}</a>
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <Sider
      id="app-sidebar"
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        height: '100vh',
      }}
      width={264}
    >
      <div className="logo-container">
        <img src={AppLogoSVG} alt="" />
      </div>
      <div className="profile-container">
        <span className="avatar">{'' || user.name.charAt(0)}</span>
        <div className="info-container">
          <h5 className="profile-name">{user.name}</h5>

          {clinics.length === 1 ? (
            <span className="profile-role">
              {clinics[0] && clinics[0].name}
            </span>
          ) : (
            <Dropdown overlay={menu}>
              <span className="profile-role">
                {activeClinic && activeClinic.name} <DownOutlined />
              </span>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="logo" />
      <Menu mode="inline" className="sider-menu-container">
        {sideMenuItems.map((item, index) => (
          <Menu.Item key={index}>
            <NavLink
              to={item.route}
              activeClassName="activeMenuItem"
              key={index}
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          </Menu.Item>
        ))}
        {/* <Menu.Item key="-1">
          <NavLink to="/d/welcome">
            <AppstoreOutlined />
            <span>Welcome</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="0" icon={<AppstoreOutlined />}>
          Whiteboard
        </Menu.Item>
        <Menu.Item key="1" icon={<TeamOutlined />}>
          Client Portal
        </Menu.Item>
        <Menu.Item key="2" icon={<BarChartOutlined />}>
          Reports
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/d/hospitals">
            <BankOutlined />
            <span>Hospital</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="4">
          <NavLink to="/d/veterinarians">
            <UserOutlined />
            <span>Users</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="5" icon={<CreditCardOutlined />}>
          Billing
        </Menu.Item> */}
        {/* <SubMenu key="sub1" icon={<SettingOutlined />} title="VEA Settings">
          <Menu.Item key="sub-1">option1</Menu.Item>
          <Menu.Item key="sub-2">option2</Menu.Item>
          <Menu.Item key="sub-3">option3</Menu.Item>
        </SubMenu> */}
      </Menu>

      <div className="signout-container">
        <Button
          type="default"
          size="large"
          icon={<LoginOutlined />}
          onClick={handleSignOutUser}
        >
          Sign Out
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
