import React, { useContext, useEffect, useRef, useState } from 'react';

//third-party library
import SignatureCanvas from 'react-signature-canvas';
import { Button, Col, Modal, notification, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { PDFViewer, BlobProvider } from '@react-pdf/renderer';
import { useQuery, useMutation } from 'react-query';
import PropTypes from 'prop-types';

//components
import { CustomInput } from 'components/CustomInput';
import TreatmentPDF from '../../../../../../../../pdf/treatmentPDF';
import { PetProfileContext } from '../../../../context';
import { AppStateContext } from 'AppContext';
import SendMailModal from './SendMailModal';

//API
import api from 'api';

const { confirm } = Modal;

const TreatmentHTML = ({
  treatmentTableData,
  medicationTableData,
  isClientAtClinic,
}) => {
  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [signURL, setSignUrl] = useState(null);
  const [confirmDeclineModal, setConfirmDeclineModal] = useState(false);
  const [reasonDeclineText, setReasonDeclineText] = useState(null);
  const [viewPDF, setViewPDF] = useState(false);
  const [fullName, setFullName] = useState('');
  const [clinicInfo, setClinicInfo] = useState(null);
  const [showSendEmailModal, setShowEmailModal] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState('');

  //Data to fill PDF
  const { petDetails } = useContext(PetProfileContext);
  const { data: petParent } = useQuery('parentInfo', () =>
    api.petParents.getPetParentDetails(petDetails?.parent_id),
  );
  const { clinics } = useContext(AppStateContext);
  useQuery('clinicInfo', () => api.clinic.getClinicInfo(clinics[0].serialId), {
    onSuccess: (data) => {
      setClinicInfo(data?.data?.clinic);
    },
  });

  useEffect(() => {
    if (petParent) {
      setFullName(
        `${petParent?.data?.petParent?.first_name} ${petParent?.data?.petParent?.last_name}`,
      );
    }
    //processTreatment(treatmentTableData);
  }, [petParent]);

  const signatureRef = useRef(null);

  const sendTreatmentPlan = useMutation(
    (payload) => api.visitation.sendTreatmentPlanApprovalEmail(payload),
    {
      onSuccess(data, variables) {
        notification.success({
          description: `Treatment plan proposal approval has been sent to ${variables.other_mail}`,
          message: 'Treatment Plan Proposal',
        });

        toggleSendEmailModal();
      },
    },
  );

  const trim = () => {
    setSignUrl(signatureRef?.current.getTrimmedCanvas().toDataURL('image/png'));
  };

  const handleClearSignature = () => {
    signatureRef?.current?.clear();
    setSignatureEmpty(true);
  };

  const approve = () => {
    trim();
    setViewPDF(true);
  };

  const decline = () => {
    showModal();
  };

  const acceptDecline = () => {
    setConfirmDeclineModal(false);
  };

  const showModal = () => {
    setConfirmDeclineModal(true);
  };

  const hideModal = () => {
    setReasonDeclineText(null);
    setConfirmDeclineModal(false);
  };

  const onDeclineText = (e) => {
    setReasonDeclineText(e.target.value);
  };

  const onChangeFullName = (e) => {
    setFullName(e.target.value);
  };

  const toggleSendEmailModal = () => {
    setShowEmailModal((prvState) => !prvState);
  };

  const treatmentPlanPdfContent = (
    <TreatmentPDF
      signURL={signURL}
      petDetails={petDetails}
      petParent={petParent}
      clinicInfo={clinicInfo}
      treatmentData={treatmentTableData}
      medicationTableData={medicationTableData}
    />
  );

  function blobToDataURL(blob, callback) {
    const newBlob = new Blob([blob], { type: 'application/pdf' });
    var a = new FileReader();
    a.onload = function (e) {
      callback(e.target.result);
    };
    a.readAsDataURL(newBlob);
  }

  const savePdfDataUrl = (data) => setPdfDataUrl(data);

  const handleSendEmail = (data) => {
    sendTreatmentPlan.mutate({
      other_mail: data?.email,
      clinic_id: clinicInfo.id,
      data_uri: pdfDataUrl,
      pet_id: petDetails?.id,
    });
  };

  return (
    <>
      <BlobProvider document={treatmentPlanPdfContent}>
        {({ blob, url, loading, error }) => {
          // Do whatever you need with blob here
          blobToDataURL(blob, savePdfDataUrl);
          return null;
        }}
      </BlobProvider>

      {viewPDF ? (
        <PDFViewer style={{ width: '100%', height: '90vh' }}>
          {treatmentPlanPdfContent}
        </PDFViewer>
      ) : (
        <div>
          <div
            className=""
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bolder',
              fontSize: 20,
            }}
          >
            <Row
              justify="center"
              style={{ width: 80, height: 80, alignItems: 'center' }}
            >
              <img src={clinicInfo?.avatar} />
            </Row>

            <Row justify="center">{clinicInfo?.clinic_name}</Row>
          </div>

          <div className="">
            <Row>Clinic Name: {clinicInfo?.clinic_name}</Row>
            <Row>{clinicInfo?.address?.line1}</Row>
            <Row>
              {clinicInfo?.address?.city}, {clinicInfo?.address?.state},{' '}
              {clinicInfo?.address?.zip}
            </Row>
            <Row>Phone Number: {clinicInfo?.contact_phone_number}</Row>
            <Row>{clinicInfo?.contact_email}</Row>
          </div>

          <div className="">
            <Row
              justify="center"
              style={{ fontFamily: 'Arial-Bold', fontSize: 20 }}
            >
              Procedure Treatment Plan
            </Row>
            <Row justify="end">{moment().format('MMMM, Do YYYY')}</Row>
          </div>

          <div className="" style={{ fontWeight: 'bolder' }}>
            <Row>Pet Name: {petDetails?.name}</Row>
            <Row style={{ marginTop: 10 }}>
              {petParent?.data?.petParent?.first_name}{' '}
              {petParent?.data?.petParent?.last_name}
            </Row>
            <Row>{petParent?.data?.petParent?.address.addressLine1}</Row>
            <Row>{petParent?.data?.petParent?.address.addressLine2}</Row>
            <Row>
              {petParent?.data?.petParent?.address.city}{' '}
              {petParent?.data?.petParent?.address.state}{' '}
              {petParent?.data?.petParent?.address.zip}
            </Row>
          </div>

          <div style={{ marginTop: 10 }}>
            <p>
              This document lists procedures to be performed on{' '}
              {petDetails?.name}. This treatment plan only approximates the cost
              of this visit. It does not include any treatments that may be
              deemed necessary upon examination and commencement of the included
              treatments. You are responsible for all fees incurred during this
              visit included or not on this treatment plan.
            </p>
            <p>
              The following is a list of the treatments, medications and/or
              supplies expected to be required during this visit and their
              approximate cost.
            </p>
            <p>
              If you have any questions concerning this treatment plan please do
              not hesitate to ask.
            </p>
          </div>

          <div style={{ width: '100%' }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Col>List of Proposed Treatment and Medications</Col>
              <Col>
                <label>Created Day: {moment().format('MM/DD/YYYY')}</label>
              </Col>
            </Row>
            <table style={{ width: '100%' }} border={1}>
              <thead>
                <tr>
                  <th width={50}>Item</th>
                  <th width={25}>Description</th>
                  <th width={25}>Qty</th>
                  <th width={25}>Charge</th>
                </tr>
              </thead>
              <tbody>
                {treatmentTableData?.map((res, key) => {
                  return (
                    <tr key={key}>
                      <td align="left">{res.name}</td>
                      <td style={{ align: 'left', padding: '1%' }}>
                        {res.description}
                      </td>
                      <td align="center">{'1'}</td>
                      <td align="center">{res.cost}</td>
                    </tr>
                  );
                })}

                {medicationTableData?.map((res, key) => {
                  return (
                    <tr key={key}>
                      <td align="left">{res?.product_name}</td>
                      <td align="left">{res?.dose_instructions || 'N/A'}</td>
                      <td align="center">
                        {res?.current_price_details?.quantity || 1}
                      </td>
                      <td align="center">
                        {res?.current_price_details?.client_price_per_unit || 0}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td />
                  <td />
                  <td align="left"></td>
                  <td align="center">
                    {(
                      +treatmentTableData
                        ?.reduce((a, b) => a + Number(b.cost), 0)
                        .toFixed(2) +
                      +medicationTableData
                        ?.reduce(
                          (a, b) =>
                            a +
                            Number(
                              b.current_price_details?.client_price_per_unit ||
                                0,
                            ),
                          0,
                        )
                        .toFixed(2)
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 20 }}>
            <p>
              Be assured that the health of {petDetails?.name} is our highest
              concern and we will do everything possible to maintain that
              health. Understand too, that your signature below indicates that
              you have reviewed and agree to the terms of this treatment plan.
            </p>
            <p>
              Your signature below does not make you responsible for the charges
              listed above unless performed upon {petDetails?.name}.
            </p>
            <p>I accept and agree to the terms of this treatment plan:</p>
          </div>

          {isClientAtClinic && (
            <>
              <Row
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                  marginBottom: 10,
                }}
              >
                <Col span={12}>
                  <label>Full Name:</label>
                  <CustomInput
                    type="text"
                    size="medium"
                    value={fullName}
                    onChange={onChangeFullName}
                  />
                </Col>
                <Col>
                  <label>Created Day:</label>
                  <p> {moment().format('MM/DD/YYYY')}</p>
                </Col>
              </Row>
              <Row>
                <Col
                  span={24}
                  style={{ border: '1px solid rgb(112 194 172 / 43%) ' }}
                >
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{
                      width: '800',
                      height: 200,
                      className: 'sigCanvas',
                    }}
                    ref={signatureRef}
                    onBegin={() => setSignatureEmpty(false)}
                  />
                </Col>
              </Row>
            </>
          )}
          <Row justify="center">
            {isClientAtClinic ? (
              <>
                <Col span={4}>
                  <Button
                    size="large"
                    type="primary"
                    className="custom-button"
                    shape="round"
                    style={{ marginTop: 40 }}
                    disabled={signatureEmpty || fullName === ''}
                    onClick={() => approve()}
                  >
                    Approve
                  </Button>
                </Col>
                <Col span={4}>
                  <Button
                    size="large"
                    type="primary"
                    className="custom-button"
                    shape="round"
                    style={{ marginTop: 40 }}
                    disabled={signatureEmpty || fullName === ''}
                    onClick={() => decline()}
                  >
                    Decline
                  </Button>
                </Col>
                <Col span={4}>
                  <Button
                    size="large"
                    type="dashed"
                    className="custom-button"
                    shape="round"
                    style={{ marginTop: 40 }}
                    onClick={handleClearSignature}
                  >
                    Re-Sign
                  </Button>
                </Col>
              </>
            ) : (
              <Col span={8} align="center">
                <Button
                  size="large"
                  type="primary"
                  className="custom-button"
                  shape="round"
                  style={{ marginTop: 40 }}
                  onClick={toggleSendEmailModal}
                >
                  Send Treatment by Email
                </Button>
              </Col>
            )}
          </Row>
        </div>
      )}

      {showSendEmailModal && (
        <SendMailModal
          email={petParent?.data?.petParent?.email}
          onCancel={toggleSendEmailModal}
          handleSendEmail={handleSendEmail}
          isSending={sendTreatmentPlan.isLoading}
        />
      )}

      <Modal
        title="Decline Rason"
        visible={confirmDeclineModal}
        onOk={() => acceptDecline()}
        onCancel={() => hideModal()}
        okText="Accept"
        cancelText="Cancel"
      >
        <p>
          Can you please provide the reason for declining this treatment plan?
        </p>
        <TextArea
          onChange={onDeclineText}
          value={reasonDeclineText}
          required
        ></TextArea>
      </Modal>
    </>
  );
};

export default TreatmentHTML;
TreatmentHTML.propTypes = {
  treatmentTableData: PropTypes.array,
  isClientAtClinic: PropTypes.bool,
  medicationTableData: PropTypes.array,
};
