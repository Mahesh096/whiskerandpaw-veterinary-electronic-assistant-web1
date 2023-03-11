import React, { useState } from 'react';

//third-party libraries
import { Button, Col, Form, notification, Row } from 'antd';

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

//components
import { CustomInput } from 'components/CustomInput';
import CardTitle from 'components/CardTitle/CardTitle';
import AddressAutocompleteInput from '../AddressAutocompleteInput';
import PropTypes from 'prop-types';

const HospitalBillingDetails = ({ options }) => {
  const [form] = Form.useForm();
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const onFinishBilling = async (event) => {
    if (!stripe || !elements) {
      return;
    }
    setIsLoadingStripe(true);

    const paymentMethod = {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          address: {
            line1: event.line1,
            line2: event.line2,
            city: event.city,
            state: event.state,
            postal_code: event.postal_code,
          },
        },
      },
    };

    const { error, setupIntent } = await stripe.confirmCardSetup(
      options?.client_secret,
      paymentMethod,
    );

    if (error) {
      notification.error({
        message: `${error.message}`,
        description: `${error.code}`,
      });
    } else {
      notification.success({
        message: 'Billing Information Updated correctly',
        description: `${setupIntent.status}`,
      });
    }
    setIsLoadingStripe(false);
  };

  return (
    <div>
      <Form
        layout="vertical"
        name="billingDetails"
        form={form}
        onFinish={onFinishBilling}
      >
        <CardTitle>Hospital Billing Details</CardTitle>
        <Row gutter={[100, 120]} justify="center">
          <Col span={10}>
            <Form.Item
              label="Credit Card Number"
              name="cardNumber"
              rules={[
                {
                  required: true,
                  message: 'Please input your credit card number!',
                },
              ]}
            >
              <CardNumberElement
                className="ant-input ant-input-lg custom-input"
                options={{ style: { base: { lineHeight: '3.1rem' } } }}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Expiry Date"
              name="expiryDate"
              rules={[
                {
                  required: true,
                  message: 'Please input your expiry date!',
                },
              ]}
            >
              <CardExpiryElement
                className="ant-input ant-input-lg custom-input"
                options={{ style: { base: { lineHeight: '3.1rem' } } }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 120]} justify="center">
          <Col span={10}>
            <Form.Item
              label="CVV Code"
              name="cvvCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your CVC!',
                },
              ]}
            >
              <CardCvcElement
                className="ant-input ant-input-lg custom-input"
                size="large"
                options={{ style: { base: { lineHeight: '3.1rem' } } }}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Address Line 1"
              name="line1"
              initialValue=""
              rules={[
                { max: 80 },
                {
                  pattern: /^((?!P\.?\s?O\.?\sBOX).)*$/gi,
                  message: 'PO Box is not allowed!',
                },
                {
                  required: true,
                  message: 'Please select valid Address Information!',
                },
              ]}
            >
              <AddressAutocompleteInput
                form={(e) => form.setFieldsValue({ line1: e })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 120]} justify="center">
          <Col span={10}>
            <Form.Item
              label="Address Line 2"
              name="line2"
              rules={[
                {
                  required: true,
                  message: 'Please input your Address Information!',
                },
                { max: 80 },
              ]}
            >
              <CustomInput size="large" type="text" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: 'Please input your city information!',
                },
              ]}
            >
              <CustomInput size="large" type="text" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 120]} justify="center">
          <Col span={10}>
            <Form.Item
              label="State"
              name="state"
              rules={[
                {
                  required: true,
                  message: 'Please input your state information!',
                },
              ]}
            >
              <CustomInput size="large" type="text" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Zip"
              name="postal_code"
              rules={[
                {
                  required: true,
                  message: 'Please input your Zip information!',
                },
              ]}
            >
              <CustomInput size="large" type="text" />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }} justify="center">
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            disabled={!stripe}
            loading={isLoadingStripe}
          >
            Save Changes
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default HospitalBillingDetails;

HospitalBillingDetails.propTypes = {
  options: PropTypes.object,
};
