// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import DataTable from 'components/DataTable';
import AddSpecie from './_partials/AddSpecie';
import EditSpecie from './_partials/EditSpecie';

// API Client
import api from 'api';

const Species = () => {
  const [showAddSpecieModal, setShowAddSpecieModal] = useState(false);
  const [showEditSpecieModal, setShowEditSpecieModal] = useState(false);
  const [editSpecieModalData, setEditSpecieModalData] = useState(null);
  const history = useHistory();

  const {
    data: speciesData,
    isLoading: isLoadingspecies,
    refetch: getAllSpecies,
  } = useQuery('species', () => api.species.getAllSpecies());

  const deleteSpecieMutation = useMutation(
    (deleteSpeciePayload) =>
      api.species.deleteSpecie({
        ...deleteSpeciePayload,
        id: deleteSpeciePayload.id,
      }),
    {
      onSuccess: () => {
        notification.success({
          message: 'Species has been successfully deleted',
          description: `You just deleted a specie!`,
        });
        getAllSpecies();
      },
      onError: (error) => {
        notification.error({
          message: 'Edit Specie Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const toggleShowAddSpecieModal = () => {
    setShowAddSpecieModal((prvState) => !prvState);
  };

  const toggleShowEditSpecieModal = (modalData) => {
    setShowEditSpecieModal((prvState) => !prvState);
    setEditSpecieModalData(modalData ? modalData : null);
  };

  const onDeleteSpecie = (deleteSpecieInfo) => {
    deleteSpecieMutation.mutate({ ...deleteSpecieInfo });
  };

  const columns = [
    {
      title: 'Specie',
      dataIndex: 'specie',
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
              onClick={() => toggleShowEditSpecieModal(record)}
              type="dashed"
              style={{ marginRight: 10 }}
            />

            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete ${record.specie}`}
              onConfirm={() => onDeleteSpecie(record)}
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
    <div id="species">
      <PageHeader title="Species" subTitle="" onBack={() => history.goBack()} />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            "We've discovered a new species of data here, it's called none. Get started by clicking: Add Species"
          }
          columns={columns}
          loading={isLoadingspecies || deleteSpecieMutation.isLoading}
          dataSource={(speciesData && speciesData.data.species) || []}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddSpecieModal}
            >
              Add Species
            </Button>
          }
        />
      </div>

      {showAddSpecieModal && (
        <AddSpecie
          visible={showAddSpecieModal}
          onCancel={toggleShowAddSpecieModal}
          getAllSpecies={getAllSpecies}
        />
      )}

      {showEditSpecieModal && (
        <EditSpecie
          visible={showEditSpecieModal}
          onCancel={toggleShowEditSpecieModal}
          getAllSpecies={getAllSpecies}
          specieData={editSpecieModalData}
        />
      )}
    </div>
  );
};

export default Species;
