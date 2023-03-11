import React, { useState } from 'react';

// third-party libraries
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';

// components
import EditPetInformation from './EditPetInformation';

// utils
import convertUnixDates, { convertUnixDate } from 'utils/convertDataString';

const PetInfo = ({ petDetails, getPetDetails }) => {
  const [showEditPet, setShowEditPet] = useState(false);
  const history = useHistory();

  const toggleShowEditPet = () => {
    setShowEditPet((pvt) => !pvt);
  };

  function calculateAgeInYears(dateString) {
    // console.log(dateString);
    var dob = new Date(dateString);

    var month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    var age_dt = new Date(month_diff);

    //extract year from date
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    var age = Math.abs(year - 1970);

    return age;
  }

  return (
    <div className="profile-details-container">
      <div className="avatar-container">
        <span>{petDetails?.name?.slice(2)}</span>
      </div>
      <div className="pet-details-container details-container">
        <span className="type-text">{petDetails.specie}</span>
        <div className="row">
          <div className="data-item">
            <span className="text-label">Name</span>
            <span className="text-value">{petDetails.name}</span>
          </div>
          <div className="data-item">
            <span className="text-label">Age</span>
            <span className="text-value">
              {calculateAgeInYears(convertUnixDates(petDetails.date_of_birth))}
              yr(s)
            </span>
          </div>
        </div>
        <div className="row">
          <div className="data-item">
            <span className="text-label">DOB</span>
            <span className="text-value">
              {convertUnixDate(petDetails.date_of_birth)}
            </span>
          </div>
          <div className="data-item">
            <span className="text-label">Breed</span>
            <span className="text-value">{petDetails.breed}</span>
          </div>
        </div>
      </div>
      <div className="owner-details-container details-container">
        <span className="type-text">Owner</span>
        <div className="row">
          <div className="data-item">
            <span className="text-label">Name</span>
            <span className="text-value">
              {petDetails.parent_firstname} {petDetails.parent_lastname}
            </span>
          </div>
          <div className="data-item">
            <span className="text-label">Phone</span>
            <span className="text-value">{petDetails.parent_phone_number}</span>
          </div>
        </div>
        <div className="row">
          <div className="data-item">
            <span className="text-label">Email</span>
            <span className="text-value">{petDetails.parent_email}</span>
          </div>
        </div>
      </div>
      <div className="add-button-container">
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={() =>
            history.push({
              search: '?soap=subjective',
            })
          }
        >
          Add New Visit
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          type="dashed"
          size="large"
          shape="round"
          icon={<EditOutlined />}
          onClick={toggleShowEditPet}
        >
          Edit Pet Info
        </Button>
      </div>

      {showEditPet && (
        <EditPetInformation
          onCancel={toggleShowEditPet}
          visible={showEditPet}
          petDetails={petDetails}
          isEditing={true}
          getPetDetails={getPetDetails}
        />
      )}
    </div>
  );
};

PetInfo.propTypes = {
  petDetails: PropTypes.object.isRequired,
  getPetDetails: PropTypes.func.isRequired,
};

export default PetInfo;
