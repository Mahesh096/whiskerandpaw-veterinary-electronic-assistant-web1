// react libraries
import React, { useEffect } from 'react';

// third-party libraries
import { Form, Row, Col, Select, Button, Input } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

const { Option } = Select;
const { TextArea } = Input;

const EditMedicationForm = ({ medicationData, onSubmit }) => {
  const [addMedicationForm] = Form.useForm();

  useEffect(() => {
    if (medicationData) {
    }
  }, [medicationData]);

  const handleInviteUser = () => {
    // mutation.mutate({ ...formValues });
  };

  return (
    <Form
      layout="vertical"
      form={addMedicationForm}
      onFinish={handleInviteUser}
    >
      <Row gutter={[30, 10]}>
        <Col span={12}>
          <Form.Item
            label="Product Name"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input product name' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Medication Category"
            name="clinicId"
            required={false}
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              className="custom-select"
              size="large"
              placeholder="Select a category"
            >
              <Option key="1" value={'laboratory'}>
                Laboratory
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Product Name"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input product name' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tax Category"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input tax category' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Volume"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input volume' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Measure"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input measure' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Quantity"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input Quantity' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Dose Instructions"
            name="name"
            required={false}
            rules={[
              { required: true, message: 'Please input dose instructions' },
            ]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Dose Instructions"
            name="name"
            required={false}
            rules={[
              { required: true, message: 'Please input dose instructions' },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Client Price Per Unit"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input price' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Dispensing Fee"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input fee' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tax"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input tax' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Client Total Price"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input price' }]}
          >
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Symptoms"
            name="name"
            required={false}
            rules={[{ required: true, message: 'Please input symptoms' }]}
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
        >
          Add Medication
        </Button>
      </Row>
    </Form>
  );
};

EditMedicationForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
};

export default EditMedicationForm;
