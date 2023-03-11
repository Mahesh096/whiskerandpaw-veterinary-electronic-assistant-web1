// react libraries
import React from 'react';

// third-party libraries
import { Button, Dropdown, Menu } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import CreateVet from './_partials/InviteUser';

// API Client
import api from 'api';

const Users = () => {
  const [showCreateVetForm, setShowCreateVetForm] = React.useState(false);
  const history = useHistory();

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: getAllUsers,
  } = useQuery('users', () => api.users.getAllUsers(), {
    onSuccess: (data) => console.log(usersData, data, isLoadingUsers),
  });

  const toggleShowCreateVetForm = () => {
    setShowCreateVetForm((prvState) => !prvState);
  };

  const menu = (
    <Menu>
      <Menu.Item>View More Details</Menu.Item>
      <Menu.Item>Edit Vet</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'contact_phone_number',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      ellipsis: true,
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
    <div id="vet">
      <PageHeader
        title="Manage Users"
        subTitle=""
        onBack={() => history.goBack()}
      />
      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            "Users haven't been added yet, but I can help with that. Get started by clicking: Invite a User"
          }
          columns={columns}
          dataSource={(usersData && usersData.data.users) || []}
          loading={isLoadingUsers}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowCreateVetForm}
            >
              Invite a User
            </Button>
          }
        />
      </div>

      {showCreateVetForm && (
        <CreateVet
          visible={showCreateVetForm}
          onCancel={toggleShowCreateVetForm}
          onCreateButtonClick={() => {}}
          getAllUsers={getAllUsers}
        />
      )}
    </div>
  );
};

export default Users;
