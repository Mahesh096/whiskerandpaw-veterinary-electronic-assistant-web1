// react libraries
import React, { useEffect } from 'react';

// third-party libraries
import { Modal, Form, Row, Col, Button, notification } from 'antd';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const EditVaccine = ({ visible, onCancel, vaccineData, getAllVaccines }) => {
  const [editVaccineForm] = Form.useForm();

  useEffect(() => {
    editVaccineForm.setFieldsValue({ ...vaccineData });
  }, []);

  const editVaccineMutation = useMutation(
    (vaccinePayload) =>
      api.vaccines.editVaccine({ ...vaccinePayload, id: vaccineData.id }),
    {
      onSuccess: () => {
        notification.success({
          message: 'Vaccine has been successfully edited',
          description: `You just edited a vaccine!`,
        });
        editVaccineForm.resetFields();
        getAllVaccines();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Edit Vaccine Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleEditVaccine = (formValues) => {
    editVaccineMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Edit Vaccine"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Save"
      footer={null}
    >
      <Form
        layout="vertical"
        form={editVaccineForm}
        onFinish={handleEditVaccine}
      >
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Product Name"
              name="name"
              required={false}
              rules={[{ required: true, message: 'Please input product name' }]}
            >
              <CustomInput size="large" type="text" placeholder="" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Vaccine Category"
              name="category"
              required={false}
              rules={[{ required: true, message: 'Please input a category' }]}
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
            loading={editVaccineMutation.isLoading}
          >
            Save Changes
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

EditVaccine.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
  vaccineData: PropTypes.object.isRequired,
  getAllVaccines: PropTypes.func.isRequired,
};

export default EditVaccine;
