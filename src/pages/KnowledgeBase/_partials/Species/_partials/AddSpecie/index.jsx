// react libraries
import React from 'react';

// third-party libraries
import { useMutation } from 'react-query';
import { Modal, Form, Row, Col, Button, notification } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const AddSpecie = ({ visible, onCancel, getAllSpecies }) => {
  const [addSpecieForm] = Form.useForm();

  const addSpecieMutation = useMutation(
    (addSpecieData) => api.species.addSpecie(addSpecieData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Species has been successfully added',
          description: `You just added a new species!`,
        });
        addSpecieForm.resetFields();
        getAllSpecies();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Species Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleAddSpecie = (formValues) => {
    addSpecieMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Add Species"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form layout="vertical" form={addSpecieForm} onFinish={handleAddSpecie}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Specie"
              name="name"
              required={false}
              rules={[{ required: true, message: 'Please input species name' }]}
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
            loading={addSpecieMutation.isLoading}
          >
            Add Species
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

AddSpecie.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAllSpecies: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
};

export default AddSpecie;
