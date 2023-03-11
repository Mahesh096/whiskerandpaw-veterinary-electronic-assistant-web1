// react libraries
import React from 'react';

// third-party libraries
import { Modal, Form, Row, Col, Select, Button, notification } from 'antd';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';

// API Client
import api from 'api';

// components
import { CustomInput } from 'components/CustomInput';

const { Option } = Select;

const CreatePermission = ({ visible, onCancel, getAllPermissions }) => {
  const [createPermissionForm] = Form.useForm();

  const {
    data: permissions,
    isLoading: isLoadingPermissions,
  } = useQuery('permissions', () => api.roles.getAllPermissions());

  const mutation = useMutation(
    (permissionDetails) => api.roles.createPermission(permissionDetails),
    {
      onSuccess: () => {
        notification.success({
          message: 'Permission has been successfully created',
          description: `The permissions has been created successfully. You can now assign it to a role.`,
        });
        getAllPermissions();
        createPermissionForm.resetFields();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Permission Creation Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleCreateRole = (formValues) => {
    mutation.mutate({ ...formValues });
  };

  const handleTypeSearch = (searchValue) => {
    if (searchValue) {
      createPermissionForm.setFieldsValue({ module: searchValue });
    }
  };
  const handleFilterOption = (input, option) => {
    return (
      option?.props?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };

  return (
    <Modal
      title="Create Permission"
      onCancel={onCancel}
      visible={visible}
      width={550}
      className="custom-modal"
      footer={null}
      maskClosable={false}
    >
      <Form
        layout="vertical"
        form={createPermissionForm}
        onFinish={handleCreateRole}
      >
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Permission Module"
              name="module"
              required={false}
              rules={[
                { required: true, message: 'Please input permission module' },
              ]}
            >
              <Select
                placeholder="Enter permission module"
                className="custom-select"
                size="large"
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) =>
                  handleFilterOption(input, option)
                }
                showArrow={false}
                notFoundContent={null}
                onSearch={handleTypeSearch}
                loading={isLoadingPermissions}
              >
                {(permissions?.data.permissions || []).map((permission) => (
                  <Option key={permission.module} value={permission.module}>
                    {permission.module}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Permission Name"
              name="name"
              required={false}
              rules={[
                { required: true, message: 'Please input permission name' },
              ]}
            >
              <CustomInput
                size="large"
                type="text"
                placeholder="E.g Edit User"
              />
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
            Create Permission
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

CreatePermission.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAllPermissions: PropTypes.func.isRequired,
};

export default CreatePermission;
