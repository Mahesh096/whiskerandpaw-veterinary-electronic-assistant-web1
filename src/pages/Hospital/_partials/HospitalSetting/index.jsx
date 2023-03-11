// react libraries
import React, { useState } from 'react';

// third-party libraries
import { notification, PageHeader } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import Card from 'components/Card';
import HospitalContactDetails from 'components/HospitalContactDetails';
import HospitalBillingDetails from 'components/HospitalBillingDetails';

//API
import api from 'api';

//Styles
import './index.less';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const HospitalSetting = () => {
  const history = useHistory();
  const [clientSecret, setClientSecret] = useState();

  const mutation = useMutation(
    (paymentData) => api.clinic.payments(paymentData),
    {
      onSuccess: ({ data }) => {
        setClientSecret(data.customer);
      },
      onError: (error) => {
        notification.error({
          message: 'Pet parents Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const options = {
    // passing the client secret obtained in step 2
    clientSecret: clientSecret?.client_secret,
    // Fully customizable with appearance API.
  };

  const getClinicDetails = (values) => {
    const paymentData = {
      clinicId: values.id,
      clinicName: values.clinic_name,
      clinicEmail: values.contact_email,
    };
    mutation.mutate(paymentData);
  };

  return (
    <div id="hospital-setting">
      <div id="data-table">
        <PageHeader
          title="Hospital Settings"
          subTitle=""
          onBack={() => history.goBack()}
        />
        <Card className="card-details">
          <HospitalContactDetails
            getClinicDetails={(value) => getClinicDetails(value)}
          />
        </Card>
        {options.clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <Card className="card-details">
              <HospitalBillingDetails options={clientSecret} />
            </Card>
          </Elements>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default HospitalSetting;
