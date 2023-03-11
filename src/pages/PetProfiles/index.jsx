// react libraries
import React, { useContext, useState } from 'react';

// third-party libraries
import { Button, PageHeader } from 'antd';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// components
import DataTable from 'components/DataTable';
import { AppStateContext } from 'AppContext';

// utils
import routePaths from 'utils/routePaths';
import convertDataString from 'utils/convertDataString';

// API Client
import api from 'api';
import { PlusOutlined } from '@ant-design/icons';
import EditPetInformation from './_partials/Profile/_partials/PetInfo/EditPetInformation';

const PetProfiles = () => {
  let history = useHistory();

  const { clinics } = useContext(AppStateContext);
  const [showEditPet, setShowEditPet] = useState(false);

  const {
    data: petsData,
    isLoading: isLoadingspecies,
    refetch: getAllPets,
  } = useQuery('pet', () => api.pet.getAllPets(clinics[0]?.serialId));

  const columns = [
    {
      title: 'Pet Name',
      dataIndex: 'name',
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      render: function Actions(record) {
        return convertDataString(record);
      },
    },
    {
      title: 'Pet Owner',
      dataIndex: 'ownerName',
    },
  ];

  const toggleShowEditPet = () => {
    setShowEditPet((pvt) => !pvt);
  };

  return (
    <div id="pet-profiles">
      <PageHeader title={`${clinics[0].name}’s Clients`} subTitle="" />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            'No furballs or drool yet, but we can fix that! Start by clicking: Add New Pet'
          }
          columns={columns}
          loading={isLoadingspecies}
          dataSource={(petsData && petsData.data.pets) || []}
          onRow={(record) => {
            return {
              onClick: () => {
                history.push(`${routePaths.petProfiles}/pet/${record.id}`);
              },
            };
          }}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowEditPet}
            >
              Add New Pet
            </Button>
          }
        />
        {showEditPet && (
          <EditPetInformation
            onCancel={toggleShowEditPet}
            visible={showEditPet}
            getAllPets={getAllPets}
            isEditing={false}
          />
        )}
      </div>
    </div>
  );
};

export default PetProfiles;
