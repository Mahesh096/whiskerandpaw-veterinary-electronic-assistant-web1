// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, notification, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import DataTable from 'components/DataTable';
import AddBreed from './_partials/AddBread';
import EditBreed from './_partials/EditBreed';

// API Client
import api from 'api';

const Breeds = () => {
  const [showAddBreedModal, setShowAddBreedModal] = useState(false);
  const [showEditBreedModal, setShowEditBreedModal] = useState(false);
  const [editBreedModalData, setEditBreedModalData] = useState(null);
  const history = useHistory();

  const {
    data: breedsData,
    isLoading: isLoadingBreeds,
    refetch: getAllBreeds,
  } = useQuery('breeds', () => api.breeds.getAllBreeds());

  const toggleShowAddBreedModal = () => {
    setShowAddBreedModal((prvState) => !prvState);
  };

  const toggleShowEditBreedModal = (modalData) => {
    setShowEditBreedModal((prvState) => !prvState);
    setEditBreedModalData(modalData ? modalData : null);
  };

  const deleteBreedMutation = useMutation(
    (breedId) => api.breeds.deleteBreed(breedId),
    {
      onSuccess: () => {
        notification.success({
          message: 'Breed has been successfully deleted',
          description: `You just deleted a breed!`,
        });
        getAllBreeds();
      },
      onError: (error) => {
        notification.error({
          message: 'Delete Breed Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const onDeleteBreed = (deleteSpecieInfo) => {
    deleteBreedMutation.mutate(deleteSpecieInfo.id);
  };

  const columns = [
    {
      title: 'Breed',
      dataIndex: 'breed',
    },
    {
      title: 'Category',
      dataIndex: 'specie',

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
              onClick={() => toggleShowEditBreedModal(record)}
              type="dashed"
              style={{ marginRight: 10 }}
            />

            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete ${record.breed}`}
              onConfirm={() => onDeleteBreed(record)}
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
    <div id="breeds">
      <PageHeader title="Breeds" subTitle="" onBack={() => history.goBack()} />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            "A dog didn't eat your data, it's just not here yet. Get started by clicking: Add Breed"
          }
          columns={columns}
          loading={isLoadingBreeds}
          dataSource={(breedsData && breedsData.data.breeds) || []}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddBreedModal}
            >
              Add Breed
            </Button>
          }
        />
      </div>

      {showAddBreedModal && (
        <AddBreed
          visible={showAddBreedModal}
          onCancel={toggleShowAddBreedModal}
          getAllBreeds={getAllBreeds}
        />
      )}

      {showEditBreedModal && (
        <EditBreed
          visible={showEditBreedModal}
          onCancel={toggleShowEditBreedModal}
          getAllBreeds={getAllBreeds}
          breedData={editBreedModalData}
        />
      )}
    </div>
  );
};

export default Breeds;
