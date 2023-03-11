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

const AddBreed = ({ visible, onCancel, getAllBreeds }) => {
  const [addBreedForm] = Form.useForm();

  const {
    data: speciesData,
    isLoading: isLoadingspecies,
    // refetch: getAllSpecies,
  } = useQuery('species', () => api.species.getAllSpecies());

  const addBreedMutation = useMutation(
    (addBreedData) => api.breeds.addBreed(addBreedData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Breed has been successfully added',
          description: `You just added a new breed!`,
        });
        addBreedForm.resetFields();
        getAllBreeds();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Breed Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleAddBreed = (formValues) => {
    addBreedMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Add Breed"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form layout="vertical" form={addBreedForm} onFinish={handleAddBreed}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Breed"
              name="name"
              required={false}
              rules={[{ required: true, message: 'Please input product name' }]}
            >
              <CustomInput size="large" type="text" placeholder="" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Species Category"
              name="specieId"
              required={false}
              rules={[{ required: true, message: 'Please input a category' }]}
            >
              <Select
                className="custom-select"
                size="large"
                placeholder="Select a category"
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
            loading={addBreedMutation.isLoading}
          >
            Add Breed
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

AddBreed.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAllBreeds: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
};

export default AddBreed;
