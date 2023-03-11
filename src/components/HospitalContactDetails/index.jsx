import React, { useContext, useState } from 'react';

//// third-party libraries
import { Button, Col, Form, notification, Row } from 'antd';
import PhoneInput from 'react-phone-number-input/input';
import { useMutation, useQuery } from 'react-query';

//components
import CardTitle from 'components/CardTitle/CardTitle';
import { CustomInput } from 'components/CustomInput';
import UploadLogo from 'components/UploadLogo';
import AddressAutocompleteInput from 'components/AddressAutocompleteInput';
import { AppStateContext } from 'AppContext';
import PropTypes from 'prop-types';

//API
import api from 'api';

const HospitalContactDetails = ({ getClinicDetails }) => {
  const { clinics } = useContext(AppStateContext);
  const [form] = Form.useForm();
  const [hospitalSettings, setHospitalSettings] = useState({});

  useQuery(
    'getHospitalSettings',
    () => api.clinic.getClinicInfo(clinics[0].serialId),
    {
      onSuccess: (res) => {
        form.setFieldsValue({ ...res.data.clinic, ...res.data.clinic.address });
        getClinicDetails(res.data.clinic);
        setHospitalSettings(res.data.clinic);
      },
    },
  );

  const mutation = useMutation(
    (contactDetails) =>
      api.clinic.updateClinic(clinics[0].serialId, contactDetails),
    {
      onSuccess: ({ data }) => {
        notification.success({
          message: 'Success Update',
          description: `${data.message}`,
        });
      },
      onError: (error) => {
        notification.error({
          message: 'Update Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleAvatar = (values) => {
    form.setFieldsValue({ avatar: values });
  };

  const onFinish = (values) => {
    const contact_phone_number = values.contact_phone_number.replace(
      /[()+]/g,
      '',
    );
    const address = {
      line1: values.line1,
      line2: values.line2,
      city: values.city,
      state: values.state,
      zip: values.zip,
    };

    const contact_details = {
      avatar: values.avatar,
      clinic_name: values.clinic_name,
      contact_email: values.contact_email,
      contact_name: values.contact_name,
      contact_phone_number: values.contact_phone_number,
      tax_rate: values.tax_rate,
    };

    delete values.google;
    mutation.mutate({
      ...contact_details,
      contact_phone_number,
      address,
    });
  };

  const onFinishFailed = (error) => {
    notification.error({
      message: 'Form Error',
      description: `${error.errorFields[0].errors.toString()}`,
    });
  };

  return (
    <div id="contact-details">
      <CardTitle>Hospital Contacts Details</CardTitle>
      <Form
        layout="vertical"
        name="contactDetails"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row justify="center">
          <Col>
            <Form.Item name="avatar" initialValue="">
              <div className="upload-logo-contact">
                <UploadLogo
                  handleAvatar={handleAvatar}
                  avatar={hospitalSettings.avatar}
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 120]} justify="center">
          <Col span={10}>
            <Form.Item
              label="Name"
              name="clinic_name"
              initialValue=""
              rules={[
                { required: true, message: 'Please input your Clinic name!' },
              ]}
            >
              <CustomInput size="large" type="text" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Email"
              name="contact_email"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: 'Please input your hospital email!',
                },
                { type: 'email', message: 'Invalid email!' },
              ]}
            >
              <CustomInput size="large" type="email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 120]} justify="center">
          <Col span={10}>
            <Form.Item
              label="Phone Number"
              initialValue=""
              name="contact_phone_number"
              rules={[
                {
                  required: true,
                  message: 'Please input your hospital phone number!',
                },
                { max: 12, message: 'Invalid phone number' },
              ]}
            >
              <PhoneInput className="ant-input ant-input-lg custom-input" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Contact Name"
              name="contact_name"
              initialValue=""
              rules={[
                { required: true, message: 'Please input your contact name!' },
              ]}
            >
              <CustomInput size="large" type="text" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 120]} justify="center">
          <Col span={10}>
            <Form.Item
              label="Tax Rate"
              name="tax_rate"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: 'Please input your tax rate!',
                },
              ]}
            >
              <CustomInput size="large" type="number" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Address Line 1"
              name="line1"
              rules={[
                { max: 100 },
                {
                  pattern: /^((?!P\.?\s?O\.?\sBOX).)*$/gi,
                  message: 'PO Box is not allowed!',
                },
                {
                  message: 'Please select valid Address Information!',
                },
              ]}
            >
              <AddressAutocompleteInput
                form={(e) => form.setFieldsValue({ line1: e })}
                initialValue={form.getFieldValue('line1')}
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
              name="zip"
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
            loading={mutation.isLoading}
          >
            {mutation.isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default HospitalContactDetails;

HospitalContactDetails.propTypes = {
  getClinicDetails: PropTypes.func.isRequired,
};
