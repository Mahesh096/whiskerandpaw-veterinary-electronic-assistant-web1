// react libraries
import React, { useState } from 'react';

// third-party libraries
import { PageHeader, Button, Popconfirm, Modal, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';

// components
import DataTable from 'components/DataTable';
import AddDifferentialForm from './_partials/AddDifferentialForm';
import EditDifferentialFrom from './_partials/EditDifferentialForm';

// API Client
import api from 'api';

const Differentials = () => {
  const [showAddDifferential, setShowAddDifferential] = useState(false);
  const [showEditDifferentialModal, setShowEditDifferentialModal] = useState({
    visible: false,
    data: null,
  });

  const [isViewDifferential, setIsViewDifferential] = useState(false);

  const history = useHistory();

  const {
    data: differentialsData,
    isLoading: isLoadingDifferentials,
    refetch: getAllDifferentials,
  } = useQuery('differentials', () => api.differentials.getAllDifferentials());

  const deleteDifferentialMutation = useMutation(
    (id) => api.differentials.deleteDifferential(id),
    {
      onSuccess: () => {
        notification.success({
          message: 'Differential has been successfully deleted',
          description: `You just deleted a differential!`,
          key: 'delete',
        });
        getAllDifferentials();
      },
      onError: (error) => {
        notification.error({
          message: 'Delete Differential Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const toggleShowEditDifferentialModal = (data) => {
    if (!data) {
      setShowEditDifferentialModal(() => ({ visible: false, data: null }));
      return;
    }

    setShowEditDifferentialModal(() => ({ visible: true, data }));
    setIsViewDifferential(false);
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
              type="dashed"
              style={{ marginRight: 10 }}
              onClick={() => toggleShowEditDifferentialModal(record)}
            />
            <Popconfirm
              placement="top"
              title={`Are you sure you want to delete ${record.name}`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                deleteDifferentialMutation.mutate(record?.id);
              }}
            >
              <Button key={text} icon={<DeleteOutlined />} type="dashed" />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const toggleAddDifferentialForm = () => {
    setShowAddDifferential((prvState) => !prvState);
  };

  return (
    <div id="differentials">
      <PageHeader
        title="Differentials"
        subTitle=""
        onBack={() => history.goBack()}
      />

      <div>
        <DataTable
          hasExportButton
          hasSearch
          noDataMessage={
            'No differentials have been added yet. Get started by clicking: Add Differential'
          }
          columns={columns}
          dataSource={differentialsData?.data?.differential || []}
          loading={
            isLoadingDifferentials || deleteDifferentialMutation.isLoading
          }
          extraElements={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={toggleAddDifferentialForm}
            >
              Add Differential
            </Button>
          }
        />
      </div>

      {showAddDifferential && (
        <Modal
          title="Add Differential"
          onCancel={toggleAddDifferentialForm}
          visible={showAddDifferential}
          width={700}
          className="custom-modal"
          footer={null}
          destroyOnClose
        >
          <AddDifferentialForm
            onCreateDone={() => {
              toggleAddDifferentialForm();
              getAllDifferentials();
            }}
          />
        </Modal>
      )}
      {showEditDifferentialModal && (
        <Modal
          title={
            isViewDifferential ? (
              <span>
                {' '}
                View Differential{' '}
                <Button
                  icon={<EditOutlined />}
                  type="dashed"
                  style={{ marginRight: 10 }}
                  onClick={() => setIsViewDifferential(false)}
                />
              </span>
            ) : (
              'Edit Differential'
            )
          }
          onCancel={() => toggleShowEditDifferentialModal()}
          visible={showEditDifferentialModal?.visible}
          width={700}
          className="custom-modal"
          footer={null}
          destroyOnClose
        >
          <EditDifferentialFrom
            onEditDone={() => {
              toggleShowEditDifferentialModal();
              getAllDifferentials();
            }}
            editData={showEditDifferentialModal?.data}
            isViewDifferential={isViewDifferential}
          />
        </Modal>
      )}
    </div>
  );
};

export default Differentials;
