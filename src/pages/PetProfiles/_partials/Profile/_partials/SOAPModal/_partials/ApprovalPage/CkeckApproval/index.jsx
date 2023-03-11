import React, { useRef, useState } from 'react';
import { Button, Col, Row } from 'antd';
import moment from 'moment';
import { CustomInput } from 'components/CustomInput';
import SignatureCanvas from 'react-signature-canvas';

const CheckApproval = () => {
  const signatureRef = useRef(null);
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  const handleClearSignature = () => {
    signatureRef?.current?.clear();
    setSignatureEmpty(true);
  };

  return (
    <>
      <div
        style={{
          width: '50%',
          margin: '0 auto',
          padding: 20,
          backgroundColor: '#d0ebb114',
        }}
      >
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
            <span>Log</span>
          </Row>

          <Row justify="center">Clinic Name</Row>
        </div>

        <div className="">
          <Row>Clinic Name: Clinic Name</Row>
          <Row>Clinic Address</Row>
          <Row>(City), (State), (Zip)</Row>
          <Row>Phone Number: Clinic Phone Number</Row>
          <Row>Clinic Email</Row>
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
          <Row>Pet Name: Test Pet Name</Row>
          <Row style={{ marginTop: 10 }}>Parent Full Name</Row>
          <Row>Address Line 1</Row>
          <Row>Address Line 2</Row>
          <Row>(City ) (State) (Zip)</Row>
        </div>

        <div style={{ marginTop: 10 }}>
          <p>
            This document lists procedures to be performed on
            <b>Pet Name</b>. This treatment plan only approximates the cost of
            this visit. It does not include any treatments that may be deemed
            necessary upon examination and commencement of the included
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

        <div style={{ width: '80%' }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Col>List of Proposed Treatment and Medications</Col>
            <Col>(Date Created)</Col>
          </Row>
          <table style={{ width: '100%' }} border={1}>
            <thead>
              <tr>
                <th width={50}>Item</th>
                <th width={25}>Qty</th>
                <th width={25}>Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Treatment Name</td>
                <td align="center">2</td>
                <td align="center">100</td>
              </tr>
              <tr>
                <td></td>
                <td align="center">Total Costs</td>
                <td align="center">100</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 20 }}>
          <p>
            Be assured that the health of <b>PetName</b> is our highest concern
            and we will do everything possible to maintain that health.
            Understand too, that your signature below indicates that you have
            reviewed and agree to the terms of this treatment plan.
          </p>
          <p>
            Your signature below does not make you responsible for the charges
            listed above unless performed upon <b>Pet Name</b>.
          </p>
          <p>I accept and agree to the terms of this treatment plan:</p>
        </div>
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
              <CustomInput type="text" size="medium" />
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
        <Row justify="center">
          <>
            <Col span={4}>
              <Button
                size="large"
                type="primary"
                className="custom-button"
                shape="round"
                style={{ marginTop: 40 }}
                disabled={signatureEmpty}
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
                disabled={signatureEmpty}
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
        </Row>
      </div>

      {/*<Modal
        title='Decline Rason'
        visible={confirmDeclineModal}
        onOk={() => acceptDecline()}
        onCancel={() => hideModal()}
        okText='Accept'
        cancelText='Cancel'
      >
        <p>
          Can you please provide the reason for declining this treatment plan?
        </p>
        <TextArea
          onChange={onDeclineText}
          value={reasonDeclineText}
          required
        ></TextArea>
      </Modal>*/}
    </>
  );
};

export default CheckApproval;
