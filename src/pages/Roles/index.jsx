// react libraries
import React, { useState } from 'react';

// third-party libraries
import { Button, Dropdown, Menu } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import CreateRole from './_partials/CreateRole';
import RolePermissions from './_partials/RolePermissions';

// API Client
import api from 'api';

// utils
import convertDataString from 'utils/convertDataString';

const Roles = () => {
  const [showCreateRoleForm, setShowCreateRoleForm] = React.useState(false);
  const [showRolePermissionsModal, setShowRolePermissionsModal] =
    useState(false);
  const [clickedRoleDetails, setClickedRoleDetails] = useState(null);
  const history = useHistory();

  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    refetch: getAllRoles,
  } = useQuery('roles', () => api.roles.getAllRoles());

  const toggleShowCreateRoleForm = () => {
    setShowCreateRoleForm((prvState) => !prvState);
  };

  const handleGetRolePermissions = (roleDetails) => {
    console.log(roleDetails);
    setClickedRoleDetails(roleDetails);
    setShowRolePermissionsModal(true);
  };

  const closeRolePermissionModal = () => {
    setClickedRoleDetails(null);
    setShowRolePermissionsModal(false);
  };

  const menu = (
    <Menu>
      <Menu.Item>View More Details</Menu.Item>
      <Menu.Item>Edit Role</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Time Created',
      dataIndex: 'created_at',
      render(record) {
        return convertDataString(record);
      },
    },
    {
      title: 'Permissions',
      dataIndex: '',
      render: function Render(record) {
        return (
          <Button
            type="dashed"
            size="small"
            data-role-id={record.id}
            onClick={() => handleGetRolePermissions(record)}
          >
            view permissions
          </Button>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: function Actions() {
        return (
          <>
            <Dropdown overlay={menu}>
              <Button type="dashed" icon={<MoreOutlined />} />
            </Dropdown>
          </>
        );
      },
    },
  ];

  return (
    <div id="roles">
      <PageHeader
        title="Manage Roles"
        subTitle=""
        onBack={() => history.goBack()}
      />
      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            "Roles haven't been assigned yet. Get started by clicking: Create Role"
          }
          columns={columns}
          dataSource={rolesData && rolesData.data?.roles}
          loading={isLoadingRoles}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowCreateRoleForm}
            >
              Create Role
            </Button>
          }
        />
      </div>

      {showCreateRoleForm && (
        <CreateRole
          visible={showCreateRoleForm}
          onCancel={toggleShowCreateRoleForm}
          getAllRoles={getAllRoles}
        />
      )}

      {showRolePermissionsModal && (
        <RolePermissions
          roleDetails={clickedRoleDetails}
          visible={showRolePermissionsModal}
          onCancel={closeRolePermissionModal}
        />
      )}
    </div>
  );
};

export default Roles;
