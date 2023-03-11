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

const EditSpecie = ({ visible, onCancel, specieData, getAllSpecies }) => {
  const [editSpecieForm] = Form.useForm();

  useEffect(() => {
    editSpecieForm.setFieldsValue({ name: specieData.specie });
  }, []);

  const editSpecieMutation = useMutation(
    (addSpecieData) =>
      api.species.editSpecie({ ...addSpecieData, id: specieData.id }),
    {
      onSuccess: () => {
        notification.success({
          message: 'Species has been successfully edited',
          description: `You just edited a specie!`,
        });
        editSpecieForm.resetFields();
        getAllSpecies();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Edit Species Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleEditSpecie = (formValues) => {
    editSpecieMutation.mutate({ ...formValues });
  };

  return (
    <Modal
      title="Edit Species"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Form layout="vertical" form={editSpecieForm} onFinish={handleEditSpecie}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Species"
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
            loading={editSpecieMutation.isLoading}
          >
            Save Changes
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

EditSpecie.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  specieData: PropTypes.object.isRequired,
  getAllSpecies: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
};

export default EditSpecie;
