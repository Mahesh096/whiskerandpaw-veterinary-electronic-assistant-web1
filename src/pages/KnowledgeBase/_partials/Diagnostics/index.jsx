// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, Modal, notification, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import DataTable from 'components/DataTable';
import EditDiagnosticsForm from 'components/EditDiagnosticsForm';
import CreateDiagnosticsForm from 'components/CreateDiagnosticsForm';

// utils
import { sortBy } from 'utils/sort';

// API Client
import api from 'api';

const Diagnostics = () => {
  const [showAddDiagnosticsModal, setShowAddDiagnosticsModal] = useState(false);
  const [showEditDiagnosticsModal, setShowEditDiagnosticsModal] = useState({
    visible: false,
    editData: null,
  });

  const history = useHistory();

  const {
    data: medicationsData,
    isLoading: isLoadingTreatments,
    isFetching: isFetchingTreatments,
    refetch: getAllTreatments,
  } = useQuery('treatments', () => api.treatment.getAllTreatments());

  const deleteDiagnosticsMutation = useMutation(
    (diagnosticsId) => api.treatment.deleteTreatment(diagnosticsId),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnostics has been successfully deleted',
          description: `You just deleted a diagnostics!`,
        });
        getAllTreatments();
      },
      onError: (error) => {
        notification.error({
          message: 'Delete Diagnostics Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const addDiagnosticsMutation = useMutation(
    (medicationPayload) =>
      api.treatment.createAdminTreatment(medicationPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnostics has been successfully added',
          description: `You just added a diagnostics!`,
        });
        getAllTreatments();
        toggleShowAddDiagnosticsModal();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Diagnostics Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const editDiagnosticsMutation = useMutation(
    (medicationPayload) => api.treatment.editAdminTreatment(medicationPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnostics has been successfully edited',
          description: `You just edited a diagnostics!`,
        });
        toggleEditModal(false);
        getAllTreatments();
      },
      onError: (error) => {
        notification.error({
          message: 'Edit Diagnostics Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleSaveDiagnostics = (formValues) => {
    addDiagnosticsMutation.mutate(formValues);
  };

  const handleEditDiagnostics = (formValues) => {
    editDiagnosticsMutation.mutate(formValues);
  };

  const toggleShowAddDiagnosticsModal = () => {
    setShowAddDiagnosticsModal((prvState) => !prvState);
  };

  const toggleEditModal = (modalVisibilityState, medicationData) => {
    setShowEditDiagnosticsModal({
      visible: modalVisibilityState,
      editData: medicationData || null,
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      ellipsis: true,
    },

    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      ellipsis: true,
      render: (cost) => `$${cost}` || 'N/A',
    },
    {
      title: 'Taxed',
      dataIndex: 'tax',
      render: (tax) => (tax ? 'Yes' : 'No'),
    },
    // {
    //   title: 'Result',
    //   dataIndex: 'result',
    //   ellipsis: true,
    // },
    {
      title: 'Action',
      dataIndex: '',
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
              onConfirm={() => deleteDiagnosticsMutation.mutate(record?.id)}
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
    <div id="treatment-inventory">
      <PageHeader
        title="Diagnostics"
        subTitle=""
        onBack={() => history.goBack()}
      />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            "The results are conclusive, you haven't added any data yet. Get started by clicking: Add Diagnostics"
          }
          columns={columns}
          dataSource={sortBy(
            (medicationsData && medicationsData.data.treatments) || [],
            {
              prop: 'created_at',
              desc: true,
            },
          )}
          loading={isLoadingTreatments || isFetchingTreatments}
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleShowAddDiagnosticsModal}
            >
              Add Diagnostics
            </Button>
          }
        />
      </div>

      {showAddDiagnosticsModal && (
        <Modal
          title="Add Diagnostics"
          onCancel={toggleShowAddDiagnosticsModal}
          visible={showAddDiagnosticsModal}
          width={1000}
          className="custom-modal"
          footer={null}
        >
          <CreateDiagnosticsForm
            handleSubmitData={handleSaveDiagnostics}
            isCreating={addDiagnosticsMutation.isLoading}
          />
        </Modal>
      )}

      {showEditDiagnosticsModal.visible && (
        <Modal
          title="Edit Diagnostics"
          onCancel={() => toggleEditModal(false)}
          visible={showEditDiagnosticsModal.visible}
          width={1000}
          className="custom-modal"
          footer={null}
        >
          <EditDiagnosticsForm
            handleSubmitData={handleEditDiagnostics}
            editData={showEditDiagnosticsModal.editData}
            isEditing={editDiagnosticsMutation.isLoading}
          />
        </Modal>
      )}
    </div>
  );
};

export default Diagnostics;
