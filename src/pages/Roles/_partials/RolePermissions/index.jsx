// react libraries
import React from 'react';

// third-party libraries
import { Modal, List, Empty, Spin } from 'antd';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

// API Client
import api from 'api';

const RolePermissions = ({ visible, onCancel, roleDetails }) => {
  const { data: data, isLoading } = useQuery(
    'rolePermissions',
    () => api.roles.getRolePermissions(roleDetails.id),
    {
      enabled: roleDetails.id ? true : false,
    },
  );

  return (
    <Modal
      title={`${roleDetails.name}'s permissions`}
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Spin spinning={isLoading} tip="Loading...">
        {data?.data?.role?.rolePermissions.length ? (
          data?.data.role?.rolePermissions.map((rolePerm) => (
            <List
              key={rolePerm.module}
              header={<strong>{rolePerm.module}</strong>}
              bordered
              dataSource={rolePerm.actions}
              renderItem={(item) => (
                <List.Item key={item.id}>{item.name}</List.Item>
              )}
            />
          ))
        ) : (
          <Empty />
        )}
      </Spin>
    </Modal>
  );
};

RolePermissions.propTypes = {
  roleDetails: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RolePermissions;
