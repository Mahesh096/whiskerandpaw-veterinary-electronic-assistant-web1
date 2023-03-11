// react libraries
import React from 'react';

// third-party libraries
import { useMutation, useQuery } from 'react-query';
import { Modal, Form, Row, Col, Button, notification, Select } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const { Option } = Select;

const EditDiagnosis = ({ visible, onCancel, getAllBreeds }) => {
  const [editDiagnosisForm] = Form.useForm();

  const {
    data: speciesData,
    isLoading: isLoadingspecies,
    // refetch: getAllSpecies,
  } = useQuery('species', () => api.species.getAllSpecies());

  const addDiagnosisMutation = useMutation(
    (addDiagnosisData) => api.diagnosis.editAdminDiagnosis(addDiagnosisData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnosis has been successfully edited',
          description: `You just edited a new diagnosis!`,
        });
        editDiagnosisForm.resetFields();
        getAllBreeds();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Diagnosis Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleAddDiagnosis = (formValues) => {
    addDiagnosisMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Edit Diagnosis"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form
        layout="vertical"
        form={editDiagnosisForm}
        onFinish={handleAddDiagnosis}
      >
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Diagnosis"
              name="name"
              required={false}
              rules={[{ required: true, message: 'Enter diagnosis name' }]}
            >
              <CustomInput size="large" type="text" placeholder="" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Diagnosis Category"
              name="diagnosis_category"
              required={false}
              rules={[{ required: true, message: 'Select diagnosis category' }]}
            >
              <Select
                className="custom-select"
                size="large"
                placeholder="Select diagnosis category"
                loading={isLoadingspecies}
              >
                {speciesData &&
                  speciesData?.data?.species.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.specie}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Treatment"
              name="treatmemt"
              required={false}
              rules={[{ required: false }]}
            >
              <Select
                className="custom-select"
                size="large"
                placeholder="Select treatment"
                loading={isLoadingspecies}
              >
                {speciesData &&
                  speciesData?.data?.species.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.specie}
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
            style={{ marginTop: 40 }}
            htmlType="submit"
            loading={addDiagnosisMutation.isLoading}
          >
            Save Changes
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

EditDiagnosis.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAllBreeds: PropTypes.func.isRequired,
};

export default EditDiagnosis;
