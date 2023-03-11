// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, Modal, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import DataTable from 'components/DataTable';
import CreateSoapForm from 'components/CreateSoapForm';
import EditSoapForm from 'components/EditSoapForm';

// API Client
import api from 'api';

const SoapConnection = () => {
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showEditMedicationModal, setShowEditMedicationModal] = useState({
    visible: false,
    editData: null,
  });
  const history = useHistory();

  const {
    data: soapData,
    isLoading: isLoadingMedications,
    refetch: getAllSoapConnections,
  } = useQuery('soaps', () => api.soap.getAllSoapConnections());

  const deleteMedicationMutation = useMutation(
    (medicationPayload) =>
      api.soap.deleteAdminSoapConnection(medicationPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'SOAP Connection has been successfully deleted',
          description: `You just deleted a SOAP Connection!`,
        });
        getAllSoapConnections();
      },
      onError: (error) => {
        notification.error({
          message: 'SOAP Connection Error',
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

  const onCreateMedicationDone = () => {
    toggleShowAddMedicationModal();
    getAllSoapConnections();
  };

  const onEditMedicationDone = () => {
    toggleEditModal(false);
    getAllSoapConnections();
  };

  const onDeleteMedications = (medicationInfo) => {
    deleteMedicationMutation.mutate({ rule_code: medicationInfo.rule_code });
  };

  const columns = [
    {
      title: 'Case',
      dataIndex: '',
      ellipsis: true,
      render: (text, record) => (
        <span key={text}>{`${record?.main_case?.name || 'N/A'}`}</span>
      ),
    },
    {
      title: 'Differentials',
      dataIndex: 'differentials',
      ellipsis: true,
      render: (text, record) => (
        <span key={text}>
          {`${record?.differentials?.map((trt) => trt?.name)?.join(',')}` ||
            'N/A'}
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      render: function Actions(text, record) {
        return (
          <>
            <Button
              style={{ marginRight: 5 }}
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => toggleEditModal(true, record)}
            />

            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete`}
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
    <div id="soap-connection-container">
      <PageHeader
        title="Conditions & Rules"
        subTitle=""
        onBack={() => history.goBack()}
      />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            "Conditions and Rules haven't been created yet. Get started by clicking: Add Condition & Rule"
          }
          columns={columns}
          dataSource={(soapData && soapData.data.rules) || []}
          loading={isLoadingMedications || deleteMedicationMutation.isLoading}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddMedicationModal}
            >
              Add Condition & Rule
            </Button>
          }
        />
      </div>

      {showAddMedicationModal && (
        <Modal
          title="Add Condition & Rule"
          onCancel={toggleShowAddMedicationModal}
          visible={showAddMedicationModal}
          width={1500}
          className="custom-modal"
          okText="Create"
          footer={null}
        >
          <CreateSoapForm onCreateDone={onCreateMedicationDone} />
        </Modal>
      )}

      {showEditMedicationModal.visible && (
        <Modal
          title="Edit Condition & Rule"
          onCancel={() => toggleEditModal(false)}
          visible={showEditMedicationModal.visible}
          width={1500}
          className="custom-modal"
          footer={null}
          destroyOnClose
        >
          <EditSoapForm
            onEditDone={onEditMedicationDone}
            editData={showEditMedicationModal.editData}
          />
        </Modal>
      )}
    </div>
  );
};

export default SoapConnection;
