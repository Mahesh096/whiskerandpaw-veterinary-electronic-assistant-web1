// react libraries
import React from 'react';

// third-party libraries
import { Modal } from 'antd';
import PropTypes from 'prop-types';

// components
import DiagnosisForm from 'components/DiagnosisForm';

// API Client

const AddDiagnosis = ({ visible, onCancel }) => {
  return (
    <Modal
      title="Add Diagnosis"
      onCancel={onCancel}
      visible={visible}
      width={500}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <DiagnosisForm />
    </Modal>
  );
};

AddDiagnosis.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddDiagnosis;
