// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import DataTable from 'components/DataTable';
import AddGender from './_partials/AddGender';
import EditGender from './_partials/EditGender';

//API
import api from 'api';

const Gender = () => {
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [showEditGenderModal, setShowEditGenderModal] = useState(false);
  const [editGenderModalData, setEditGenderModalData] = useState(null);
  const history = useHistory();

  const {
    data: gendersData,
    isLoading: isLoadingGenders,
    refetch: getAllGenders,
  } = useQuery('genders', () => api.genders.getAllGenders());

  const deleteGenderMutation = useMutation(
    (genderPayload) => api.genders.deleteGender(genderPayload?.id),
    {
      onSuccess: () => {
        notification.success({
          message: 'Gender has been successfully deleted',
          description: `You just deleted a gender!`,
        });
        getAllGenders();
      },
      onError: (error) => {
        notification.error({
          message: 'Delete Gender Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const toggleShowAddVaccineModal = () => {
    setShowAddVaccineModal((prvState) => !prvState);
  };

  const toggleShowEditGenderModal = (modalData) => {
    setShowEditGenderModal((prvState) => !prvState);
    setEditGenderModalData(modalData ? modalData : null);
  };

  const onDeleteGender = (deleteGenderInfo) => {
    deleteGenderMutation.mutate(deleteGenderInfo);
  };

  const columns = [
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: function Actions(text, record) {
        return (
          <>
            <Button
              key={text}
              icon={<EditOutlined />}
              onClick={() => toggleShowEditGenderModal(record)}
              type="dashed"
              style={{ marginRight: 10 }}
              hidden={true}
            />

            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete ${record.gender}`}
              onConfirm={() => onDeleteGender(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button key={text} icon={<DeleteOutlined />} type="dashed" />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div id="gender">
      <PageHeader title="Gender" subTitle="" onBack={() => history.goBack()} />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            'Men are from mars, and no data is from an empty database. Get started by clicking: Add Gender'
          }
          columns={columns}
          loading={isLoadingGenders}
          dataSource={(gendersData && gendersData.data.genders) || []}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddVaccineModal}
            >
              Add Gender
            </Button>
          }
        />
      </div>

      {showAddVaccineModal && (
        <AddGender
          visible={showAddVaccineModal}
          onCancel={toggleShowAddVaccineModal}
          getAllGenders={getAllGenders}
        />
      )}

      {showEditGenderModal && (
        <EditGender
          visible={showEditGenderModal}
          onCancel={toggleShowEditGenderModal}
          getAllGender={getAllGenders}
          genderData={editGenderModalData}
        />
      )}
    </div>
  );
};

export default Gender;
