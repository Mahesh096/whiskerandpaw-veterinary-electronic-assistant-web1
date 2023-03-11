// react libraries
import React from 'react';

// third-party libraries
import { useMutation, useQuery } from 'react-query';
import { Form, Row, Col, Button, notification, Select } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const { Option } = Select;

const AddDifferentialForm = ({ onCreateDone }) => {
  const [addDifferentialForm] = Form.useForm();

  const {
    data: differentialCategoriesData,
    isLoading: isLoadingDifferentialCategories,
  } = useQuery('differentialCategory', () =>
    api.differentials.getDifferentialCategory(),
  );

  const addDifferentialMutation = useMutation(
    (addDiagnosisData) =>
      api.differentials.createDifferential(addDiagnosisData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Differential has been successfully added',
          description: `You just added a new Differential!`,
        });
        addDifferentialForm.resetFields();
        onCreateDone();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Differential Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleAddDiagnosis = (formValues) => {
    addDifferentialMutation.mutate({
      ...formValues,
      category:
        differentialCategoriesData?.data?.differentials.filter(
          (dif) => dif?.id === formValues.category_id,
        )[0]?.name || '',
      main_category_id: 1,
    });
  };

  return (
    <Form
      layout="vertical"
      form={addDifferentialForm}
      onFinish={handleAddDiagnosis}
    >
      <Row gutter={[30, 10]}>
        <Col span={12}>
          <Form.Item
            label="Differential Name"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Enter differential name' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Differential Category"
            name="category_id"
            required={false}
            rules={[
              { required: true, message: 'Select differential category' },
            ]}
          >
            <Select
              className="custom-select"
              size="large"
              placeholder="Select category"
              loading={isLoadingDifferentialCategories}
            >
              {differentialCategoriesData &&
                differentialCategoriesData?.data?.differentials?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
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
          loading={addDifferentialMutation.isLoading}
        >
          Add Diffenential
        </Button>
      </Row>
    </Form>
  );
};

AddDifferentialForm.propTypes = {
  onCreateDone: PropTypes.func.isRequired,
};

export default AddDifferentialForm;
