// react libraries
import React, { useEffect } from 'react';

// third-party libraries
import { useMutation } from 'react-query';
import { Modal, Form, Row, Col, Button, notification } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const EditGender = ({ visible, onCancel, genderData, getAllGender }) => {
  const [editGenderForm] = Form.useForm();

  useEffect(() => {
    editGenderForm.setFieldsValue({ gender: genderData.gender });
  }, []);

  const editGenderMutation = useMutation(
    (addGenderData) => api.genders.editGender(genderData.id, addGenderData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Gender has been successfully edited',
          description: `You just edited a gender!`,
        });
        editGenderForm.resetFields();
        getAllGender();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Edit Gender Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleEditGender = (formValues) => {
    editGenderMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Edit Gender"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form layout="vertical" form={editGenderForm} onFinish={handleEditGender}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Gender"
              name="gender"
              required={false}
              rules={[{ required: true, message: 'Please input gender name' }]}
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
            loading={editGenderMutation.isLoading}
          >
            Save Changes
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

EditGender.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  genderData: PropTypes.object.isRequired,
  getAllGender: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
};

export default EditGender;
