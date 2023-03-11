// react libraries
import React, { useContext } from 'react';

// third-party libraries
import { Modal, Form, Row, Col, Select, Button, notification } from 'antd';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';

// API Client
import api from 'api';

// components
import { CustomInput } from 'components/CustomInput';
import { AppStateContext } from 'AppContext';

const { Option, OptGroup } = Select;

const CreateRole = ({ visible, onCancel, getAllRoles }) => {
  const { user } = useContext(AppStateContext);

  const [createRoleForm] = Form.useForm();

  const { data: permissions, isLoading: isLoadingPermissions } = useQuery(
    'permissions',
    () => api.roles.getAllPermissions(),
    {
      onSuccess: (data) => console.log(permissions, data, isLoadingPermissions),
    },
  );

  const mutation = useMutation(
    (userDetails) => api.roles.createRole(userDetails),
    {
      onSuccess: () => {
        notification.success({
          message: 'Role has been successfully created',
          description: `The role has been created successfully. You can now assign it to a user.`,
        });
        getAllRoles();
        createRoleForm.resetFields();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Role Creation Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleCreateRole = (formValues) => {
    mutation.mutate({ ...formValues, orgId: user.orgId });
  };

  return (
    <Modal
      title="Create Role"
      onCancel={onCancel}
      visible={visible}
      width={550}
      className="custom-modal"
      footer={null}
      maskClosable={false}
    >
      <Form layout="vertical" form={createRoleForm} onFinish={handleCreateRole}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Role Name"
              name="roleName"
              required={false}
              rules={[{ required: true, message: 'Please input role name' }]}
            >
              <CustomInput
                size="large"
                type="text"
                placeholder="E.g Administrator"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Role Permissions"
              name="actions"
              required={false}
              rules={[{ required: true, message: 'Please input role name' }]}
            >
              <Select className="custom-input" size="large" mode="multiple">
                {permissions?.data?.permissions.map((permission) => (
                  <OptGroup
                    label={`${permission.module}`}
                    key={permission.module}
                  >
                    {permission.actions.map((action) => (
                      <Option key={action.id} value={action.id}>
                        {action.name}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Button
            size="large"
            type="primary"
            className="custom-button"
            loading={mutation.isLoading}
            style={{ marginTop: 40 }}
            htmlType="submit"
          >
            Create Role
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

CreateRole.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAllRoles: PropTypes.func.isRequired,
};

export default CreateRole;
