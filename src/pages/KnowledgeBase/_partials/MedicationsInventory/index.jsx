// react libraries
import React, { useState } from 'react';

// third-party libraries
import {
  PageHeader,
  Button,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  notification,
} from 'antd';
import { PlusOutlined, MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import DataTable from 'components/DataTable';

// API Client
import api from 'api';
import ViewMedication from './_partials/ViewMedication';
import CreateMedicationsForm from 'components/CreateMedicationsForm';
import EditMedicationForm from 'components/EditMedicationForm';

const MedicationsInventory = () => {
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showEditMedicationModal, setShowEditMedicationModal] = useState({
    visible: false,
    editData: null,
  });
  const [showViewMedicationModal, setShowViewMedicationModal] = useState(false);
  const [viewMedicationData, setViewMedicationModal] = useState(null);
  const history = useHistory();

  const {
    data: medicationsData,
    isLoading: isLoadingMedications,
    refetch: getAllMedications,
  } = useQuery('medications', () => api.medications.getAllMedications());

  const deleteMedicationMutation = useMutation(
    (medicationPayload) => api.medications.deleteMedication(medicationPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Medication has been successfully deleted',
          description: `You just deleted a medication!`,
        });
        getAllMedications();
      },
      onError: (error) => {
        notification.error({
          message: 'Delete Medication Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const toggleShowAddMedicationModal = () => {
    setShowAddMedicationModal((prvState) => !prvState);
  };

  const toggleEditModal = (modalVisibilityState, medicationData) => {
    setShowEditMedicationModal({
      visible: modalVisibilityState,
      editData: medicationData || null,
    });
  };

  const openViewMedicationModal = (medicationData) => {
    setViewMedicationModal(medicationData);
    setShowViewMedicationModal(true);
  };

  const closeViewMedicationModal = () => {
    setViewMedicationModal(null);
    setShowViewMedicationModal(false);
  };

  const onCreateMedicationDone = () => {
    toggleShowAddMedicationModal();
    getAllMedications();
  };

  const onEditMedicationDone = () => {
    toggleEditModal(false);
    getAllMedications();
  };

  const onDeleteMedications = (medicationInfo) => {
    deleteMedicationMutation.mutate(medicationInfo);
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
    },
    {
      title: 'Product Category',
      dataIndex: 'category',
      ellipsis: true,
    },
    {
      title: 'Dose Instructions',
      dataIndex: 'dose_instructions',
      ellipsis: true,
    },
    {
      title: 'Action',
      dataIndex: '',
      render: function Actions(text, record) {
        return (
          <>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item onClick={() => openViewMedicationModal(record)}>
                    View
                  </Menu.Item>
                  <Menu.Item onClick={() => toggleEditModal(true, record)}>
                    Edit
                  </Menu.Item>
                </Menu>
              }
            >
              <Button
                style={{ marginRight: 5 }}
                type="dashed"
                icon={<MoreOutlined />}
              />
            </Dropdown>

            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete ${record.product_name}`}
              onConfirm={() => onDeleteMedications(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="dashed"
                key={text}
                icon={<DeleteOutlined />}
              ></Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div id="medications-inventory">
      <PageHeader
        title="Medications"
        subTitle=""
        onBack={() => history.goBack()}
      />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            'Do you need a prescription for this missing data? Get started by clicking: Add Medication'
          }
          columns={columns}
          dataSource={
            (medicationsData && medicationsData.data.medications) || []
          }
          loading={isLoadingMedications || deleteMedicationMutation.isLoading}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddMedicationModal}
            >
              Add Medication
            </Button>
          }
        />
      </div>

      {showAddMedicationModal && (
        <Modal
          title="Add Medication"
          onCancel={toggleShowAddMedicationModal}
          visible={showAddMedicationModal}
          width={1000}
          className="custom-modal"
          okText="Create"
          footer={null}
        >
          <CreateMedicationsForm onCreateDone={onCreateMedicationDone} />
        </Modal>
      )}

      {showEditMedicationModal.visible && (
        <Modal
          title="Edit Medication"
          onCancel={() => toggleEditModal(false)}
          visible={showEditMedicationModal.visible}
          width={1000}
          className="custom-modal"
          footer={null}
        >
          <EditMedicationForm
            onEditDone={onEditMedicationDone}
            editData={showEditMedicationModal.editData}
          />
        </Modal>
      )}

      {showViewMedicationModal && (
        <ViewMedication
          onCancel={closeViewMedicationModal}
          visible={showViewMedicationModal}
          medicationData={viewMedicationData}
        />
      )}
    </div>
  );
};

export default MedicationsInventory;
