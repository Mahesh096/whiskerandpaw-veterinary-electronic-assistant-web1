import React from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import PropTypes from 'prop-types';

/*
* Receive a function setting the value of the form with the name of the input
* Ex: <AddressAutocompleteInput
         form={(e)=>form.setFieldsValue({ line1: e})}
     />
* */

const AddressAutocompleteInput = ({ form, initialValue }) => {
  const { ref: antRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
    onPlaceSelected: (place) => {
      form(place.name);
    },
    options: {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['place_id', 'name', 'types'],
    },
  });

  const handleChange = () => {
    form(null);
  };

  return (
    <input
      defaultValue={initialValue}
      onBeforeInput={handleChange}
      ref={antRef}
      className="ant-input ant-input-lg custom-input"
    />
  );
};

export default AddressAutocompleteInput;

AddressAutocompleteInput.propTypes = {
  form: PropTypes.func,
  initialValue: PropTypes.string,
};
