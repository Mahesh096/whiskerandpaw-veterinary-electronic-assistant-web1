// react libraries
import React, { useContext, useState } from 'react';

// third-party libraries
import { Modal, Timeline, Select, Button, Typography, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { PetProfileContext } from '../../context';
import { useQuery, useMutation } from 'react-query';

// API Client
import api from 'api';

//utils
import convertDataString from 'utils/convertDataString';

const { Option } = Select;
const { Text } = Typography;

const StatusModal = ({ visible, onCancel, visitId }) => {
  const { statusData, isFetchingStatus } = useContext(PetProfileContext);

  const [selectedStatus, setSelectedStatus] = useState('');

  const getAllStatusByVisitId = useQuery('', () =>
    api.visitation.getAllStatusByVisitId(visitId),
  );

  const updateVisitationStatus = useMutation(
    (payload) => api.visitation.updateVisitationStatus(payload),
    {
      onSuccess: () => {
        getAllStatusByVisitId.refetch();
      },
      onError: (error) => {},
    },
  );

  const handleUpdateVisitationStatus = () => {
    updateVisitationStatus.mutate({
      visit_id: visitId,
      event: selectedStatus,
    });
  };

  const isLoadingLogs =
    getAllStatusByVisitId.isLoading || getAllStatusByVisitId.isFetching;

  return (
    <Modal
      title="Status Timeline"
      onCancel={onCancel}
      visible={visible}
      width={550}
      okText="Create"
      footer={null}
      maskClosable={false}
    >
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ marginBottom: 20 }}>
          Update Visit Status
        </Text>

        <div>
          <Select
            style={{
              width: 300,
              marginRight: 20,
              marginTop: 10,
              marginBottom: 20,
            }}
            loading={isFetchingStatus}
            onChange={(value) => setSelectedStatus(value)}
          >
            {statusData?.data?.events?.map((status) => (
              <Option key={status} value={status}>
                {status.toUpperCase()}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={handleUpdateVisitationStatus}
            loading={updateVisitationStatus.isLoading}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {isLoadingLogs && <Skeleton active />}

      {!isLoadingLogs && (
        <Timeline>
          {!!getAllStatusByVisitId.data?.data?.logs?.length &&
            getAllStatusByVisitId.data?.data?.logs?.map((log) => (
              <Timeline.Item>
                {log?.user_name} updated status to{' '}
                <Text strong>{log?.event}</Text>{' '}
                {convertDataString(log?.created_at)}
              </Timeline.Item>
            ))}
        </Timeline>
      )}
    </Modal>
  );
};

StatusModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  visitId: PropTypes.number.isRequired,
};

export default StatusModal;
