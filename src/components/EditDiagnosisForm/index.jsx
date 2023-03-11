// react libraries
import React, { useEffect, useState } from 'react';

// third-party libraries
import { useMutation, useQuery } from 'react-query';
import { Form, Row, Col, Button, notification, Select, Input } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';
import TextAreaWithMic from '../TextAreaWithMic';

// API Client
import api from 'api';

const { Option } = Select;

const EditDiagnosisForm = ({
  onEditDone,
  editData,
  type,
  handleEditDiagonisSubmit,
}) => {
  const [editDiagnosisForm] = Form.useForm();
  const [fieldDict, setFieldDict] = useState('');

  useEffect(() => {
    if (editData) {
      editDiagnosisForm.setFieldsValue({
        name: editData.name,
        category_id: Number(editData.category_id),
        code: editData.code,
        description: editData.description,
        symptoms: editData.symptoms,
      });
    }
  }, [editData]);

  const {
    data: diagnosisCategoriesData,
    isLoading: isLoadingDiagnosisCategories,
  } = useQuery('diagnosisCategories', () =>
    api.diagnosis.getDiagnosisCategory(),
  );

  const editDiagnosisMutation = useMutation(
    (editDiagnosisData) => api.diagnosis.editAdminDiagnosis(editDiagnosisData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnosis has been successfully edited',
          description: `You just edited a new diagnosis!`,
        });
        editDiagnosisForm.resetFields();
        onEditDone && onEditDone();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Diagnosis Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const editDiagnosisClinicMutation = useMutation(
    (editDiagnosisData) => api.diagnosis.editDiagnosis(editDiagnosisData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Diagnosis has been successfully edited',
          description: `You just edited a new diagnosis!`,
        });
        editDiagnosisForm.resetFields();
        onEditDone && onEditDone();
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
    const payload = { ...formValues, id: editData.id };
    if (handleEditDiagonisSubmit) {
      handleEditDiagonisSubmit(payload);
      return;
    }
    type === 'admin'
      ? editDiagnosisMutation.mutate(payload)
      : editDiagnosisClinicMutation.mutate(payload);
  };

  return (
    <Form
      layout="vertical"
      form={editDiagnosisForm}
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
          <TextAreaWithMic
            name={'description'}
            label={'Description'}
            form={editDiagnosisForm}
            value={editDiagnosisForm.getFieldValue('description')}
            autoSize={{ minRows: 4, maxRows: 5 }}
            required={false}
          />
        </Col>
      </Row>

      <Row gutter={[30, 10]}>
        <Col span={24}>
          <TextAreaWithMic
            name={'symptoms'}
            label={'Symptoms'}
            form={editDiagnosisForm}
            value={editDiagnosisForm.getFieldValue('symptoms')}
            autoSize={{ minRows: 4, maxRows: 5 }}
            required={false}
          />
        </Col>
      </Row>

      <Row justify="end">
        <Button
          size="large"
          type="primary"
          className="custom-button"
          style={{ marginTop: 40 }}
          htmlType="submit"
          loading={
            editDiagnosisMutation.isLoading && !editDiagnosisMutation.isError
          }
        >
          Save Changes
        </Button>
      </Row>
    </Form>
  );
};

EditDiagnosisForm.propTypes = {
  type: PropTypes.string,
  onEditDone: PropTypes.func,
  editData: PropTypes.object.isRequired,
  handleEditDiagonisSubmit: PropTypes.func,
};

export default EditDiagnosisForm;
