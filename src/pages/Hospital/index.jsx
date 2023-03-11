// react libraries
import React from 'react';

// third-party libraries
import { Button, Dropdown, Menu } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';

// components
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';

import CreateHospital from './_partials/CreateHospital';

const Hospital = () => {
  const [showCreateHospitalForm, setShowCreateHospitalForm] =
    React.useState(false);

  const toggleShowCreateHospitalForm = () => {
    setShowCreateHospitalForm((prvState) => !prvState);
  };

  const menu = (
    <Menu>
      <Menu.Item>View More Details</Menu.Item>
      <Menu.Item>Edit Hospital</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
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

  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Joshua Edigbe ${i}`,
      email: 'joshuaedigbe@gmail.com',
      phone: '08059920701',
      address: `London, Park Lane no. ${i}`,
      status: false,
    });
  }

  return (
    <div id="hospital">
      <PageHeader title="Manage Hospitals" subTitle="" />
      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={"Oops! Looks like we don't have any data here yet."}
          columns={columns}
          dataSource={data}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowCreateHospitalForm}
            >
              Create Hospital
            </Button>
          }
        />
      </div>

      <CreateHospital
        visible={showCreateHospitalForm}
        onCancel={toggleShowCreateHospitalForm}
        onCreateButtonClick={() => {}}
      />
    </div>
  );
};

export default Hospital;
