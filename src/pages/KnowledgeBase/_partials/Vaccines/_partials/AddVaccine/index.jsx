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

const AddVaccine = ({ visible, onCancel, getAllVaccines }) => {
  const [addVaccineForm] = Form.useForm();

  const addVaccineMutation = useMutation(
    (vaccineData) => api.vaccines.addVaccine(vaccineData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Vaccine has been successfully added',
          description: `You just added a new vaccine!`,
        });
        addVaccineForm.resetFields();
        getAllVaccines();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Vaccine Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const { data: vaccineCategoriesData, isLoading: isLoadingVaccineCategories } =
    useQuery('vaccines-categories', () => api.vaccines.getVaccineCategories());

  const handleAddVaccine = (formValues) => {
    addVaccineMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Add Vaccine"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form layout="vertical" form={addVaccineForm} onFinish={handleAddVaccine}>
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
              rules={[{ required: true, message: 'Please input category' }]}
            >
              <Select
                className="custom-select"
                size="large"
                placeholder="Select a category"
                loading={isLoadingVaccineCategories}
              >
                {vaccineCategoriesData &&
                  vaccineCategoriesData?.data?.categories?.map((item) => (
                    <Option
                      key={item.vaccine_category}
                      value={item.vaccine_category}
                    >
                      {item.vaccine_category}
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
            loading={addVaccineMutation.isLoading}
          >
            Add Vaccine
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

AddVaccine.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
  getAllVaccines: PropTypes.func.isRequired,
};

export default AddVaccine;
