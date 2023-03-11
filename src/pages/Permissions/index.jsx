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

// API Client
import api from 'api';

// utils
import ViewPermissions from './_partials/ViewPermissions';
import CreatePermission from './_partials/CreatePermission';

const Permissions = () => {
  const [showViewModulePermissionsModal, setShowViewModulePermissionsModal] =
    useState(false);
  const [
    showCreateModulePermissionsModal,
    setShowCreateModulePermissionsModal,
  ] = useState(false);
  const [clickedPermissionDetails, setClickedPermissionDetails] =
    useState(null);
  const history = useHistory();

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    refetch: getAllPermissions,
  } = useQuery('permissions', () => api.roles.getAllPermissions());

  const toggleCreateModulePermissionsModal = () => {
    setShowCreateModulePermissionsModal((prvState) => !prvState);
  };

  const handleViewModulePermissionsModal = (permissionDetails) => {
    setClickedPermissionDetails(permissionDetails);
    setShowViewModulePermissionsModal(true);
  };

  const closeRolePermissionModal = () => {
    setClickedPermissionDetails(null);
    setShowViewModulePermissionsModal(false);
  };

  const menu = (
    <Menu>
      <Menu.Item>Delete Permission</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Module',
      dataIndex: 'module',
      width: 300,
    },
    {
      title: 'Permissions',
      dataIndex: '',
      render: function Render(record) {
        return (
          <Button
            type="dashed"
            size="small"
            onClick={() => handleViewModulePermissionsModal(record)}
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
    <div id="permissions">
      <PageHeader
        title="Manage Permissions"
        subTitle=""
        onBack={() => history.goBack()}
      />
      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            'No permissions have been created yet. Get started by clicking: Create Permission'
          }
          columns={columns}
          dataSource={permissionsData && permissionsData.data?.permissions}
          loading={isLoadingPermissions}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleCreateModulePermissionsModal}
            >
              Create Permission
            </Button>
          }
        />
      </div>

      {showViewModulePermissionsModal && (
        <ViewPermissions
          permissionDetails={clickedPermissionDetails}
          visible={showViewModulePermissionsModal}
          onCancel={closeRolePermissionModal}
        />
      )}

      {showCreateModulePermissionsModal && (
        <CreatePermission
          getAllPermissions={getAllPermissions}
          onCancel={toggleCreateModulePermissionsModal}
          visible={showCreateModulePermissionsModal}
        />
      )}
    </div>
  );
};

export default Permissions;
