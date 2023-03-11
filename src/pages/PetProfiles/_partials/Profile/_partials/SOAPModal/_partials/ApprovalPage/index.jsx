//react
import React from 'react';
import PropTypes from 'prop-types';

//third-party
import { Modal } from 'antd';
import TreatmentHTML from 'pages/PetProfiles/_partials/Profile/_partials/SOAPModal/_partials/ApprovalPage/treatmentHTML';

const ApprovalPage = ({
  approvalPage,
  toggleApprovalPage,
  treatmentTableData,
  isClientAtClinic,
  medicationTableData,
}) => {
  return (
    <Modal
      title="Approval Page"
      visible={approvalPage}
      onCancel={toggleApprovalPage}
      width="60rem"
      style={{ padding: '1rem 0 0 0' }}
      className="custom-modal"
      footer={null}
    >
      <TreatmentHTML
        treatmentTableData={treatmentTableData}
        isClientAtClinic={isClientAtClinic}
        medicationTableData={medicationTableData}
      />
    </Modal>
  );
};

export default ApprovalPage;

ApprovalPage.propTypes = {
  approvalPage: PropTypes.bool.isRequired,
  toggleApprovalPage: PropTypes.func.isRequired,
  treatmentTableData: PropTypes.array,
  isClientAtClinic: PropTypes.bool.isRequired,
  medicationTableData: PropTypes.array,
};
