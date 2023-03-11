// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, Modal, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

// components
import DataTable from 'components/DataTable';
import DiagnosisForm from 'components/DiagnosisForm';
import EditDiagnosisForm from 'components/EditDiagnosisForm';

// API client
import api from 'api';

const Diagnosis = () => {
  const history = useHistory();

  const [showAddDiagnosisModal, setShowAddDiagnosisModal] = useState(false);
  const [showEditDiagnosisModal, setShowEditDiagnosisModal] = useState({
    visible: false,
    editData: null,
  });

  const {
    data: diagnosisData,
    isLoading: isLoadingAllDiagnosis,
    refetch: getAllDiagnosis,
  } = useQuery('diagnosis', () => api.diagnosis.getAllDiagnosisAdmin());

  const deleteDiagnosisMutation = useMutation(
    (diagnosisPayload) => api.diagnosis.deleteAdminDiagnosis(diagnosisPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnosis has been successfully deleted',
          description: `You just deleted a diagnosis!`,
        });
        getAllDiagnosis();
      },
      onError: (error) => {
        notification.error({
          message: 'Delete Diagnosis Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const toggleShowAddDiagnosisModal = () => {
    setShowAddDiagnosisModal((prvState) => !prvState);
  };

  const onCreateDiagnosisDone = () => {
    toggleShowAddDiagnosisModal();
    getAllDiagnosis();
  };

  const onEditDiagnosisDone = () => {
    toggleEditModal();
    getAllDiagnosis();
  };

  const toggleEditModal = (modalVisibilityState, diagnosisData) => {
    setShowEditDiagnosisModal({
      visible: modalVisibilityState,
      editData: diagnosisData || null,
    });
  };

  const onDeleteDiagnosis = (deleteDiagnosisInfo) => {
    deleteDiagnosisMutation.mutate(deleteDiagnosisInfo);
  };

  const columns = [
    {
      title: 'Diagnosis',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (text) => <span>{text || 'N/A'}</span>,
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text) => <span>{text || 'N/A'}</span>,
      ellipsis: true,
    },
    {
      title: 'Commmon Symptoms',
      dataIndex: 'symptoms',
      render: (text) => <span>{text || 'N/A'}</span>,
      ellipsis: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: function Actions(text, record) {
        return (
          <>
            <Button
              type="dashed"
              id={text}
              icon={<EditOutlined />}
              onClick={() => toggleEditModal(true, record)}
              style={{ marginRight: 5 }}
            />

            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete ${record.name}`}
              onConfirm={() => onDeleteDiagnosis(record)}
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
    <div id="diagnosis">
      <PageHeader
        title="Diagnosis"
        subTitle=""
        onBack={() => history.goBack()}
      />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            "You've been diagnosed with no data, but it's not terminal. Get started by clicking: Add Diagnosis"
          }
          columns={columns}
          dataSource={diagnosisData?.data?.diagnosis}
          loading={isLoadingAllDiagnosis || deleteDiagnosisMutation.isLoading}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddDiagnosisModal}
            >
              Add Diagnosis
            </Button>
          }
        />
      </div>

      {showAddDiagnosisModal && (
        <Modal
          title="Add Diagnosis"
          onCancel={toggleShowAddDiagnosisModal}
          visible={showAddDiagnosisModal}
          width={800}
          className="custom-modal"
          okText="Create"
          footer={null}
        >
          <DiagnosisForm onCreateDone={onCreateDiagnosisDone} />
        </Modal>
      )}

      {showEditDiagnosisModal.visible && (
        <Modal
          title="Edit Diagnosis"
          onCancel={() => toggleEditModal(false)}
          visible={showEditDiagnosisModal.visible}
          width={800}
          className="custom-modal"
          okText="Saving Changes"
          footer={null}
        >
          <EditDiagnosisForm
            onEditDone={onEditDiagnosisDone}
            editData={showEditDiagnosisModal.editData}
            type="admin"
          />
        </Modal>
      )}
    </div>
  );
};

export default Diagnosis;
