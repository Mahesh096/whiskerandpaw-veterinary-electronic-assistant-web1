//React
import React, { useContext, useState } from 'react';

//third-party libraries
import { Button, Dropdown, Menu, notification, Popconfirm } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';

//utils
import convertDataString from 'utils/convertDataString';

//components
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import CreateClientInformation from './_partials/CreateClientInformation';

//API
import api from 'api';
import { AppStateContext } from 'AppContext';

const ClientInformation = () => {
  const [showCreateClientForm, setShowCreateClientForm] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [editPetParentData, setEditPetParentData] = useState(null);
  const { clinics } = useContext(AppStateContext);

  const mutation = useMutation((id) => api.petParents.deletePetParent(id), {
    onSuccess: () => {
      notification.success({
        message: 'Pet Parent has been successfully deleted',
        description: `Pet Parent has been successfully deleted.`,
      });
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: 'Pet Parent Error',
        description: `${error.response.data.message}`,
      });
    },
  });

  const {
    data,
    isLoading: isLoadingPetParents,
    refetch,
  } = useQuery('petParentsData', () =>
    api.petParents.getAllPetParents(clinics[0].serialId),
  );

  const toggleShowUpdateClientForm = (val) => {
    setIsCreate(false);
    setEditPetParentData(val);
    setShowCreateClientForm((state) => !state);
  };

  const toggleShowCreateClientForm = () => {
    setIsCreate(true);
    setShowCreateClientForm((state) => !state);
  };

  const delPetParent = (val) => {
    mutation.mutate(val.id);
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'firstName',
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      ellipsis: true,
      key: 'lastName',
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phoneNumber',
      sorter: (a, b) => a.phone_number - b.phone_number,
      ellipsis: true,
    },
    {
      title: 'Last Visit Date',
      dataIndex: 'last_visit',
      key: 'last_visit',
      render(record) {
        return convertDataString(record);
      },
      sorter: (a, b) => a.last_visit.localeCompare(b.last_visit),
    },
    {
      title: 'Appointment Date',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      render(record) {
        return convertDataString(record);
      },
      sorter: (a, b) => a.appointment_date.localeCompare(b.appointment_date),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: function Actions(record) {
        return (
          <>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item onClick={() => toggleShowUpdateClientForm(record)}>
                    Edit
                  </Menu.Item>
                  <Menu.Item>
                    <Popconfirm
                      title="Are you sure to delete this Pet Parent?"
                      onConfirm={() => delPetParent(record)}
                      okText="Yes"
                      cancelText="No"
                    >
                      Delete
                    </Popconfirm>
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="dashed" icon={<MoreOutlined />} />
            </Dropdown>
          </>
        );
      },
    },
  ];

  return (
    <div id="pet-parents">
      <PageHeader title="Pet Parents" subTitle="" />
      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            'No pet parents have been added yet, but I can help with that. Get started by clicking: Add Pet Parent'
          }
          columns={columns}
          dataSource={data?.data.petParents}
          loading={isLoadingPetParents}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowCreateClientForm}
            >
              Add Pet Parent
            </Button>
          }
        />
      </div>

      {showCreateClientForm && (
        <CreateClientInformation
          visible={showCreateClientForm}
          onCancel={toggleShowCreateClientForm}
          isCreate={isCreate}
          petParentData={isCreate ? null : editPetParentData}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default ClientInformation;
