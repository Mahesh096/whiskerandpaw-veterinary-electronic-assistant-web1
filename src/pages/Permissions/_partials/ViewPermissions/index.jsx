// react libraries
import React from 'react';

// third-party libraries
import { Modal, List } from 'antd';
import PropTypes from 'prop-types';

const ViewPermissions = ({ visible, onCancel, permissionDetails }) => {
  return (
    <Modal
      title={`${permissionDetails.module}'s permissions`}
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <List
        key={permissionDetails.module}
        bordered
        dataSource={permissionDetails.actions}
        renderItem={(item) => <List.Item key={item.id}>{item.name}</List.Item>}
      />
    </Modal>
  );
};

ViewPermissions.propTypes = {
  permissionDetails: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ViewPermissions;
