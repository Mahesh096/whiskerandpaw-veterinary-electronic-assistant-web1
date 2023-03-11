import React from 'react';

//third-party libraries
import { Col, DatePicker, Divider, Form, Row } from 'antd';
import AutoComplete from 'react-google-autocomplete';

//components
import { CustomInput } from 'components/CustomInput';

import PropTypes from 'prop-types';

const ClientInformationDetails = ({ handleAddressSelect }) => {
  return (
    <div id="client-information-details">
      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              {
                required: true,
                message: 'Please input your First Name!',
              },
              {
                pattern: /^[a-zA-Z]+(-?[a-zA-Z]+)?$/,
                message: 'First Name may contain only letters and 1 hyphen.',
              },
              {
                max: 100,
                message: 'First Name must be 1 to 100 characters!',
              },
            ]}
          >
            <CustomInput type="text" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              {
                required: true,
                message: 'Please input your Last Name!',
              },
              {
                pattern: /^[a-zA-Z]+(-?[a-zA-Z]+)?$/,
                message: 'Last Name may contain only letters and 1 hyphen.',
              },
              {
                max: 100,
                message: 'Last Name must be 1 to 100 characters!',
              },
            ]}
          >
            <CustomInput type="text" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              {
                required: true,
                message: 'Please input your Phone Number!',
              },
              {
                pattern: /^[0-9]+$/,
                message: 'Phone Number must not contain special characters!',
              },
              {
                len: 10,
                message: 'Phone Number must be 10-digits.',
              },
            ]}
          >
            <CustomInput type="text" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
              {
                type: 'email',
                message: 'Please input correct Email!',
              },
            ]}
          >
            <CustomInput type="email" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
          <Form.Item
            label="Date Of Birth"
            name="date_of_birth"
            rules={[
              {
                required: true,
                message: 'Please input your Date of Birth!',
              },
              {
                type: 'date',
                message: 'Please input correct Date!',
              },
            ]}
          >
            <DatePicker
              size="large"
              className="ant-input ant-input-lg custom-input"
              picker="date"
            />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
      </Row>

      <Divider orientation="left" style={{ fontSize: 18 }}>
        Emergency Contact
      </Divider>

      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
          <Form.Item
            label="First Name"
            name="erFirstName"
            rules={[
              {
                required: true,
                message: 'Please input your First Name!',
              },
              {
                pattern: /^[a-zA-Z]+(-?[a-zA-Z]+)?$/,
                message: 'First Name may contain only letters and 1 hyphen.',
              },
              {
                max: 100,
                message: 'First Name must be 100 characters or less!',
              },
            ]}
          >
            <CustomInput type="text" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Last Name"
            name="erLastName"
            rules={[
              {
                required: true,
                message: 'Please input your Last Name!',
              },
              {
                pattern: /^[a-zA-Z]+(-?[a-zA-Z]+)?$/,
                message: 'Last Name may contain only letters and 1 hyphen.',
              },
              {
                max: 100,
                message: 'Last Name must be 100 characters or less!',
              },
            ]}
          >
            <CustomInput type="text" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
          <Form.Item
            label="Phone Number"
            name="emergencyPhoneNumber"
            rules={[
              {
                required: true,
                message: 'Please input your Emergency Contact Phone Number!',
              },
              {
                pattern: /^[0-9]+$/,
                message: 'Phone number must not contain special characters!',
              },
              {
                len: 10,
                message: 'Phone Number must be 10-digits.',
              },
            ]}
          >
            <CustomInput type="text" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
      </Row>

      <Divider orientation="left" style={{ fontSize: 18 }}>
        Billing Details
      </Divider>

      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
          <Form.Item
            label="Address Line 1"
            name="addressLine1"
            initialValue=""
            rules={[
              {
                required: true,
                message: 'Please input your Address Information!',
              },
              {
                max: 100,
                message: 'Address Line 1 must be 100 characters or less!',
              },
              {
                pattern: /^((?!P\.?\s?O\.?\sBOX).)*$/gi,
                message: 'PO Box is not allowed!',
              },
            ]}
          >
            <AutoComplete
              className="ant-input ant-input-lg custom-input"
              apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
              onPlaceSelected={(place) => {
                handleAddressSelect(place.formatted_address);
              }}
              options={{
                types: ['address'],
                componentRestrictions: { country: 'us' },
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Address Line 2"
            name="addressLine2"
            rules={[
              {
                required: false,
                message: 'Please input your Address Information!',
              },
              {
                max: 100, // max 100 characters to match BE
                message: 'Address Line 2 must be 100 characters or less!',
              },
            ]}
          >
            <CustomInput size="large" type="text" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
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
        <Col span={12}>
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
      </Row>
      <Row gutter={[30, 10]} justify="center">
        <Col span={12}>
          <Form.Item
            label="Zip Code"
            name="zip"
            rules={[
              {
                required: true,
                message: 'Please input your Zip Code information!',
              },
            ]}
          >
            <CustomInput size="large" type="text" />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
      </Row>
    </div>
  );
};

export default ClientInformationDetails;

ClientInformationDetails.propTypes = {
  handleAddressSelect: PropTypes.func.isRequired,
};
