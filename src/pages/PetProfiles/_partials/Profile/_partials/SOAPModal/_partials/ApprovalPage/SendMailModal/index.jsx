import React, { useEffect } from 'react';

// third-party libraries
import PropTypes from 'prop-types';
import { Modal, Form, Row, Col, Input, Button } from 'antd';

const SendMailModal = ({ onCancel, email, handleSendEmail, isSending }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (email) {
      form.setFieldsValue({ email });
    }
  }, [email]);

  const onSubmit = (values) => {
    handleSendEmail(values);
  };

  return (
    <Modal
      title="Verify Email Address"
      visible
      footer={null}
      width={400}
      onCancel={onCancel}
      destroyOnClose
    >
      <p>
        Please verify that the email below is where you’d like the treatment
        plan sent for approval
      </p>
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Email"
              name="email"
              required={false}
              rules={[
                { required: true, message: 'Please enter email address' },
              ]}
            >
              <Input size="large" type="email" placeholder="" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Button type="primary" htmlType="submit" loading={isSending}>
            Send treatment plan
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

SendMailModal.propTypes = {
  email: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  handleSendEmail: PropTypes.func.isRequired,
};

export default SendMailModal;
