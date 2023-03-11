// react libraries
import React, { useEffect } from 'react';

// third-party libraries
import PropTypes from 'prop-types';
import { Modal, Form, Row, Col, Button, notification, Select } from 'antd';
import { useMutation, useQuery } from 'react-query';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const { Option } = Select;

const EditBreed = ({ visible, onCancel, breedData, getAllBreeds }) => {
  const [editBreedForm] = Form.useForm();

  useEffect(() => {
    editBreedForm.setFieldsValue({
      name: breedData.breed,
      specieId: breedData.specie_id,
    });
  }, []);

  const {
    data: speciesData,
    isLoading: isLoadingspecies,
    // refetch: getAllSpecies,
  } = useQuery('species', () => api.species.getAllSpecies());

  const editBreedMutation = useMutation(
    (breedPayload) =>
      api.breeds.editBreed({ ...breedPayload, id: breedData.id }),
    {
      onSuccess: () => {
        notification.success({
          message: 'Breed has been successfully edited',
          description: `You just edited a breed!`,
        });
        editBreedForm.resetFields();
        getAllBreeds();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Edit Breed Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleEditBreed = (formValues) => {
    editBreedMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Edit Breed"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Save"
      footer={null}
    >
      <Form layout="vertical" form={editBreedForm} onFinish={handleEditBreed}>
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
            loading={editBreedMutation.isLoading}
          >
            Save Changes
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

EditBreed.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
  breedData: PropTypes.object.isRequired,
  getAllBreeds: PropTypes.func.isRequired,
};

export default EditBreed;
