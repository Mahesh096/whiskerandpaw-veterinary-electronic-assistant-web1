// react libraries
import React, { useEffect, useState } from 'react';

// third-party components
import { Form, Row, Col, Button, notification } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { useParams, useHistory } from 'react-router';

// components
import AuthPageWrapper from 'components/AuthPageWrapper';
import { CustomInput, CustomInputPassword } from 'components/CustomInput';

// API
import api from 'api';

// styles
import './index.less';

const SetNewPassword = () => {
  const [isUserSignUp, setIsUserSignUp] = useState(true);

  const { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    setIsUserSignUp(() => history.location.pathname.includes('user'));
  }, []);

  const { data: userData, isLoading: isLoadingClinicInfo } = useQuery(
    'clinicInfo',
    () => api.clinic.verifyClinicSignupToken(id),
    {
      onSuccess: (data) => console.log(data),
      enabled: !isUserSignUp,
    },
  );

  const verifyClinicMutation = useMutation(
    (clinicSetupPayload) => api.clinic.completeClinicSetup(clinicSetupPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Signup Successful',
          description: `Yo! Your signup process is now complete. You can now signin with your email and password.`,
        });

        history.push('/');
      },
      onError: (error) => {
        console.log(error.response.data);
        notification.error({
          message: `Signup Error`,
          description: `${error.response.data.messsage}`,
        });
      },
    },
  );

  const handleSetNewPassword = (formValues) => {
    verifyClinicMutation.mutate({
      ...formValues,
      userId: userData.data.details.user.id,
      confirm: undefined,
    });
  };

  return (
    <AuthPageWrapper formTitle="Set New Password">
      <div id="set-new-password">
        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleSetNewPassword}
        >
          <Row gutter={[0, 10]}>
            {!isUserSignUp && (
              <Col span={24}>
                <Form.Item
                  label={
                    isLoadingClinicInfo
                      ? 'loading question...'
                      : `${
                          userData
                            ? `${userData.data.details.answer.question}`
                            : ''
                        }`
                  }
                  name="answer"
                  rules={[
                    { required: true, message: 'Please enter your answer' },
                  ]}
                >
                  <CustomInput
                    size="large"
                    placeholder="Enter security answer"
                    loading={isLoadingClinicInfo}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password' },
                ]}
              >
                <CustomInputPassword size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'The two passwords that you entered do not match!',
                      );
                    },
                  }),
                ]}
              >
                <CustomInputPassword size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                className="custom-button"
                size="large"
                block
                htmlType="submit"
                loading={verifyClinicMutation.isLoading}
              >
                {verifyClinicMutation.isLoading ? 'Please wait...' : 'Continue'}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </AuthPageWrapper>
  );
};

export default SetNewPassword;
