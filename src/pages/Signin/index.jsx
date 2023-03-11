// react libraries
import React, { useContext } from 'react';

// third-party components
import { Form, Row, Col, Button, notification } from 'antd';
import { useMutation } from 'react-query';
import { Link, useHistory } from 'react-router-dom';

// components
import AuthPageWrapper from 'components/AuthPageWrapper';
import { CustomInput, CustomInputPassword } from 'components/CustomInput';
import { AppStateDispatchContext } from 'AppContext';

// utils
import setAuthToken from 'utils/setAuthToken';

// API
import api from 'api';

// styles
import './index.less';

const Signin = () => {
  const { setAppState } = useContext(AppStateDispatchContext);
  const history = useHistory();

  const mutation = useMutation(
    (loginDetails) => api.auth.signin(loginDetails),
    {
      onSuccess: (data) => {
        setAppState({ isAuthenticated: true, ...data.data });

        setAuthToken(data.data.token);

        localStorage.setItem('whiskerUserDetails', JSON.stringify(data.data));

        history.push('/d/welcome');
      },
      onError: (error) => {
        notification.error({
          message: 'Signin Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleLogin = (formValues) => {
    mutation.mutate(formValues);
  };

  return (
    <AuthPageWrapper formTitle="Sign In">
      <div id="signin">
        <Form layout="vertical" requiredMark={false} onFinish={handleLogin}>
          <Row gutter={[0, 10]}>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email' }]}
              >
                <CustomInput size="large" type="email" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password' },
                ]}
              >
                <CustomInputPassword size="large" />
              </Form.Item>
            </Col>
            <div className="forgot-password-container">
              <a href="">Forgot Password?</a>
            </div>
            <Col span={24}>
              <Button
                type="primary"
                className="custom-button"
                size="large"
                block
                htmlType="submit"
                loading={mutation.isLoading}
              >
                {mutation.isLoading && !mutation.isError
                  ? 'Signing in...'
                  : 'Sign In'}
              </Button>
            </Col>
          </Row>

          <Button type="link" className="custom-button" size="large" block>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </Form>
      </div>
    </AuthPageWrapper>
  );
};

export default Signin;
