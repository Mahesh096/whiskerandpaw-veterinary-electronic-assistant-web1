// react libraries
import React, { useState } from 'react';

// third-party components
import { useMutation } from 'react-query';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Row, Col, Button, notification, Modal, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

// components
import AuthPageWrapper from 'components/AuthPageWrapper';
import { CustomInput } from 'components/CustomInput';

// API
import api from 'api';

// styles
import './index.less';

const Signup = () => {
  const [showQuestionAndAnswer, setShowQuestionAndAnswer] = useState(false);
  const [securityQuestionAndAnswer, setSecurityQuestionAndAnswer] = useState(
    {},
  );
  const [signupForm] = Form.useForm();

  const mutation = useMutation(
    (signupDetails) => api.clinic.signup(signupDetails),
    {
      onSuccess: () => {
        notification.success({
          message: 'Clinic Successfully Created',
          description: `Your clinic has been created successfully, please check your email for instructions on how to proceed.`,
        });
        signupForm.resetFields();
      },
      onError: (error) => {
        notification.error({
          message: `Signup Error - ${error.response.data.message}`,
          description: `${error.response.data.error}`,
        });
      },
    },
  );

  const handleLogin = (formValues) => {
    mutation.mutate({
      ...formValues,
      ...securityQuestionAndAnswer,
      organizationName: formValues.organizationName || formValues.clinicName,
      domain: window.location.origin,
    });
  };

  const toggleShowQuestionAndAnswer = () => {
    setShowQuestionAndAnswer((prvState) => !prvState);
  };

  const handleSecurityForm = (securityQuestionValue) => {
    toggleShowQuestionAndAnswer();
    setSecurityQuestionAndAnswer(securityQuestionValue);
    signupForm.submit();
  };

  return (
    <AuthPageWrapper formTitle="Sign Up" className="signup-custom-layout">
      <div id="signup">
        <Form
          layout="vertical"
          form={signupForm}
          requiredMark={false}
          onFinish={handleLogin}
        >
          <h3>Clinic Details</h3>

          <Row gutter={[20, 10]}>
            <Col sm={24} md={12}>
              <Form.Item
                label="Name"
                name="clinicName"
                rules={[
                  { required: true, message: 'Please input clinic name' },
                ]}
              >
                <CustomInput
                  size="large"
                  type="text"
                  placeholder="Clinic Name"
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12}>
              <Form.Item
                label="Address"
                name="clinicAddress"
                rules={[
                  {
                    required: true,
                    message: 'Please input your clinic address',
                  },
                ]}
              >
                <CustomInput
                  size="large"
                  type="text"
                  placeholder="Clinic Address"
                />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item
                label={
                  <>
                    <span>Organisation Name (Optional) &nbsp;</span>
                    <Tooltip title="This is the name of the parent company of the clinic.">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </>
                }
                name="organizationName"
                rules={[
                  {
                    message: 'Please input your clinic address',
                  },
                ]}
              >
                <CustomInput
                  size="large"
                  type="text"
                  placeholder="Organisation Name"
                />
              </Form.Item>
            </Col>
          </Row>
          <h3>Contact Person Details</h3>

          <Row gutter={[20, 5]}>
            <Col sm={24} md={12}>
              <Form.Item
                label="Full Name"
                name="contactName"
                rules={[
                  {
                    required: true,
                    message: 'Please input contact person name',
                  },
                ]}
              >
                <CustomInput
                  size="large"
                  type="text"
                  placeholder="Contact Person Name"
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12}>
              <Form.Item
                label="Email"
                name="contactEmail"
                rules={[
                  {
                    required: true,
                    message: 'Please input your contact person email address',
                  },
                ]}
              >
                <CustomInput
                  size="large"
                  type="email"
                  placeholder="Contact Person Email"
                />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item
                label="Phone Number"
                name="contactPhoneNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please input your contact person phone number',
                  },
                ]}
              >
                <CustomInput
                  size="large"
                  type="tel"
                  placeholder="Contact Person Phone Number"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Button
                type="primary"
                className="custom-button"
                size="large"
                block
                loading={mutation.isLoading}
                onClick={toggleShowQuestionAndAnswer}
              >
                {mutation.isLoading ? 'Signing you up...' : 'Sign Up'}
              </Button>
            </Col>
          </Row>

          <Button type="link" className="custom-button" size="large" block>
            <Link to="/">Sign In</Link>
          </Button>
        </Form>
        {showQuestionAndAnswer ? (
          <Modal
            className="custom-modal"
            visible={true}
            maskClosable={false}
            centered
            footer={null}
            title="Please provide a security question and answer"
            onCancel={toggleShowQuestionAndAnswer}
          >
            <Form
              layout="vertical"
              requiredMark={false}
              onFinish={handleSecurityForm}
            >
              <Row gutter={[20, 5]}>
                <Col sm={24}>
                  <Form.Item
                    label="Question"
                    name="question"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter question',
                      },
                    ]}
                  >
                    <CustomInput
                      size="large"
                      type="text"
                      placeholder="Enter your preferred security question"
                    />
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item
                    label="Answer"
                    name="answer"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter answer',
                      },
                    ]}
                  >
                    <CustomInput
                      size="large"
                      type="text"
                      placeholder="Security Answer"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                className="custom-button"
                size="large"
                block
                htmlType="submit"
              >
                Continue
              </Button>
            </Form>
          </Modal>
        ) : null}
      </div>
    </AuthPageWrapper>
  );
};

export default Signup;
