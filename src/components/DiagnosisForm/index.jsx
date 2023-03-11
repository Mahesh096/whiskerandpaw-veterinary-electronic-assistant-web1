// react libraries
import React from 'react';

// third-party libraries
import { useMutation, useQuery } from 'react-query';
import { Form, Row, Col, Button, notification, Select, Input } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const { Option } = Select;
const { TextArea } = Input;

const DiagnosisForm = ({ onCreateDone }) => {
  const [addDiagnosisForm] = Form.useForm();

  const {
    data: diagnosisCategoriesData,
    isLoading: isLoadingDiagnosisCategories,
  } = useQuery('diagnosisCategories', () =>
    api.diagnosis.getDiagnosisCategory(),
  );

  const addDiagnosisMutation = useMutation(
    (addDiagnosisData) => api.diagnosis.createAdminDiagnosis(addDiagnosisData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnosis has been successfully added',
          description: `You just added a new diagnosis!`,
        });
        addDiagnosisForm.resetFields();
        onCreateDone();
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
    <Form
      layout="vertical"
      form={addDiagnosisForm}
      onFinish={handleAddDiagnosis}
    >
      <Row gutter={[30, 10]}>
        <Col span={12}>
          <Form.Item label="Name" name="name" required={false}>
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Category" name="category_id" required={false}>
            <Select
              className="custom-select"
              size="large"
              placeholder="Select diagnosis category"
              loading={isLoadingDiagnosisCategories}
            >
              {diagnosisCategoriesData &&
                diagnosisCategoriesData?.data?.categories?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30, 10]}>
        <Col span={24}>
          <Form.Item label="Description" name="description" required={false}>
            <TextArea
              className="custom-textarea"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30, 10]}>
        <Col span={24}>
          <Form.Item label="Symptoms" name="symptoms" required={false}>
            <TextArea
              className="custom-textarea"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
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
          Add Diagnosis
        </Button>
      </Row>
    </Form>
  );
};

DiagnosisForm.propTypes = {
  onCreateDone: PropTypes.func.isRequired,
};

export default DiagnosisForm;
