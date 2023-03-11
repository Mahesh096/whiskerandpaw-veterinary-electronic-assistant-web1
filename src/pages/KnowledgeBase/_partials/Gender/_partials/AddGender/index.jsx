// react libraries
import React from 'react';

// third-party libraries
import { Modal, Form, Row, Col, Button, notification } from 'antd';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';

// components
import { CustomInput } from 'components/CustomInput';
import api from 'api';

const AddGender = ({ visible, onCancel, getAllGenders }) => {
  const [addGenderForm] = Form.useForm();

  const addGenderMutation = useMutation(
    (addGenderData) => api.genders.addGender(addGenderData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Gender has been successfully added',
          description: `You just added a new gender!`,
        });
        addGenderForm.resetFields();
        getAllGenders();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Gender Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleInviteUser = (formValues) => {
    addGenderMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Add Gender"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form layout="vertical" form={addGenderForm} onFinish={handleInviteUser}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Gender"
              name="gender"
              required={false}
              rules={[{ required: true, message: 'Please input gender' }]}
            >
              <CustomInput size="large" type="text" placeholder="" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Button
            size="large"
            type="primary"
            className="custom-button"
            style={{ marginTop: 40 }}
            htmlType="submit"
            loading={addGenderMutation.isLoading}
          >
            Add Gender
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

AddGender.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAllGenders: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
};

export default AddGender;
