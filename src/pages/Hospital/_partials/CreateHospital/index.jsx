// react libraries
import React from 'react';

// third-party libraries
import { Modal, Form, Row, Col } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

const CreateHospital = ({ visible, onCancel }) => {
  return (
    <Modal
      title="Create Hospital"
      onCancel={onCancel}
      visible={visible}
      width={700}
      className="custom-modal"
      okText="Create"
    >
      <Form layout="vertical">
        <Row gutter={[30, 10]}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: 'Please input your username' },
              ]}
            >
              <CustomInput size="large" type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="Email"
              rules={[{ required: true, message: 'Please input your email' }]}
            >
              <CustomInput size="large" type="email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="number"
              rules={[
                { required: true, message: 'Please input your phone number' },
              ]}
            >
              <CustomInput size="large" type="tel" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address' }]}
            >
              <CustomInput size="large" type="tel" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

CreateHospital.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
};

export default CreateHospital;
