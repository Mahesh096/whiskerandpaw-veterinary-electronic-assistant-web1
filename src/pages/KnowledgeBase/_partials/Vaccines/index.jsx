// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, notification, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import DataTable from 'components/DataTable';
import AddVaccine from './_partials/AddVaccine';
import EditVaccine from './_partials/EditVaccine';

// API Client
import api from 'api';

const Vaccines = () => {
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [showEditVaccineModal, setShowEditVaccineModal] = useState(false);
  const [editVaccineModalData, setEditVaccineModalData] = useState(null);
  const history = useHistory();

  const {
    data: vaccinesData,
    isLoading: isLoadingVaccines,
    refetch: getAllVaccines,
  } = useQuery('vaccines', () => api.vaccines.getAllVaccines());

  const deleteVaccinesMutation = useMutation(
    (vaccinePayload) => api.vaccines.deleteVaccine(vaccinePayload?.id),
    {
      onSuccess: () => {
        notification.success({
          message: 'Vaccine has been successfully deleted',
          description: `You just deleted a vaccine!`,
        });
        getAllVaccines();
      },
      onError: (error) => {
        notification.error({
          message: 'Delete Vaccine Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const toggleShowAddVaccineModal = () => {
    setShowAddVaccineModal((prvState) => !prvState);
  };

  const toggleShowEditVaccineModal = (modalData) => {
    setShowEditVaccineModal((prvState) => !prvState);
    setEditVaccineModalData(modalData ? modalData : null);
  };

  const onDeleteVaccine = (deleteVaccineInfo) => {
    deleteVaccinesMutation.mutate(deleteVaccineInfo);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',

      ellipsis: true,
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
              onClick={() => toggleShowEditVaccineModal(record)}
              type="dashed"
              style={{ marginRight: 10 }}
            />

            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete ${record.name}`}
              onConfirm={() => onDeleteVaccine(record)}
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
    <div id="vaccines">
      <PageHeader
        title="Vaccines"
        subTitle=""
        onBack={() => history.goBack()}
      />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            'You need an inoculation against this missing data. Get started by clicking: Add Vaccine'
          }
          columns={columns}
          loading={isLoadingVaccines}
          dataSource={(vaccinesData && vaccinesData.data.vaccines) || []}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddVaccineModal}
            >
              Add Vaccine
            </Button>
          }
        />
      </div>

      {showAddVaccineModal && (
        <AddVaccine
          visible={showAddVaccineModal}
          onCancel={toggleShowAddVaccineModal}
          getAllVaccines={getAllVaccines}
        />
      )}

      {showEditVaccineModal && (
        <EditVaccine
          visible={showEditVaccineModal}
          onCancel={toggleShowEditVaccineModal}
          vaccineData={editVaccineModalData}
          getAllVaccines={getAllVaccines}
        />
      )}
    </div>
  );
};

export default Vaccines;
