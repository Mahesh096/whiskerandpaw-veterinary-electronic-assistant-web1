// react libraries
import React, { useContext } from 'react';

// third-party libraries
import { Modal, Form, Row, Col, Select, Button, notification } from 'antd';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-query';

import { AppStateContext } from 'AppContext';

// API Client
import api from 'api';

// components
import { CustomInput } from 'components/CustomInput';

const { Option } = Select;

const InviteUser = ({ visible, onCancel, getAllUsers }) => {
  const { user, clinics } = useContext(AppStateContext);
  const [inviteUserForm] = Form.useForm();

  const { data: data, isLoading: isLoadingRoles } = useQuery('roles', () =>
    api.roles.getAllRoles(),
  );

  const mutation = useMutation(
    (userDetails) =>
      api.users.inviteUser({
        ...userDetails,
        domain: window.location.origin,
        userId: user.id,
      }),
    {
      onSuccess: () => {
        notification.success({
          message: 'User has been successfully invited',
          description: `The user you just invited would get an email on how to proceed.`,
        });
        inviteUserForm.resetFields();
        getAllUsers && getAllUsers();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Invite User Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleInviteUser = (formValues) => {
    mutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Invite User"
      onCancel={onCancel}
      visible={visible}
      width={800}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form layout="vertical" form={inviteUserForm} onFinish={handleInviteUser}>
        <Row gutter={[30, 10]}>
          <Col span={12}>
            <Form.Item
              label="Full name"
              name="name"
              required={false}
              rules={[
                { required: true, message: 'Please input your username' },
              ]}
            >
              <CustomInput
                size="large"
                type="text"
                placeholder="E.g John Doe"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              required={false}
              rules={[{ required: true, message: 'Please input your email' }]}
            >
              <CustomInput
                size="large"
                type="email"
                placeholder="E.g johndoe@gmail.com"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="contactPhoneNumber"
              required={false}
              rules={[
                { required: true, message: 'Please input your phone number' },
              ]}
            >
              <CustomInput
                size="large"
                type="tel"
                placeholder="E.g +230949838848"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Clinic"
              name="clinicId"
              required={false}
              rules={[
                { required: true, message: 'Please select clinic for user' },
              ]}
              initialValue={clinics[0] && clinics[0].id}
            >
              <Select
                className="custom-select"
                size="large"
                placeholder="Select clinic"
                loading={isLoadingRoles}
                disabled={clinics && clinics.length === 1}
              >
                {clinics.map((clinic) => (
                  <Option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Role"
              name="roleId"
              required={false}
              rules={[
                { required: true, message: 'Please select role for user' },
              ]}
            >
              <Select
                className="custom-select"
                size="large"
                placeholder="Select role"
                loading={isLoadingRoles}
              >
                {data &&
                  data.data.roles.map((role) => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
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
            Send Invite
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

InviteUser.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func,
};

InviteUser.defaultProps = {
  getAllUsers: () => {},
};

export default InviteUser;
