//React Components
import React from 'react';

//components
import PhysicalExamHTML from './_Partials/PhysicalExamHTML';
import CustomTableHTML from './_Partials/CustomTableHTML';
import LogoClinic from 'imgs/LogoClinic.jpg';

//third-party components
import { Row } from 'antd';

//styles
import './index.less';

//MOCK DATA
import {
  carePlanMockData,
  diagnosisMockData,
  finalChargeMockData,
  physicalExamMockData,
  testResultMockData,
} from '../mock_data';

const FinalSummaryHTML = () => {
  return (
    <div className="container">
      <Row justify="center">
        <img className="logo" alt="Logo" src={LogoClinic} />
      </Row>
      <Row style={{ marginTop: 10 }} gutter={[30, 10]} justify="center">
        <h2>{`Hospital Name`}</h2>
      </Row>

      <div>
        <Row>{`{Name of hospital}`}</Row>
        <Row>{`{Physical Address Line 1}`}</Row>
        <Row>{`{Physical Address Line 2}`}</Row>
        <Row>{`{City}, {State}, {Zip}`}</Row>
        <Row style={{ marginTop: 10 }}>{`{Phone number}`}</Row>
        <Row>{`{Email address}`}</Row>
      </div>

      <div className="title">
        <Row justify="center">—-------</Row>
        <Row justify="center">
          <h3>Combined</h3>
        </Row>
        <Row justify="center">
          <h3>Final Visit Summary & Invoice</h3>
        </Row>
      </div>

      <div>
        <Row style={{ marginTop: 10 }} justify="end">{`{Today Date}`}</Row>
      </div>

      <div>
        <Row>{`{Pet’s Name}`}</Row>
        <Row style={{ marginTop: 10 }}>{`{Client Name}`}</Row>
        <Row>{`{Client Billing Address Line 1}`}</Row>
        <Row>{`{Client Billing Address Line 2}`}</Row>
        <Row>{`{city}, {State}, {Zip}`}</Row>
      </div>

      <div>
        <Row style={{ marginTop: 30 }}>
          <table border={1} width="80%">
            <tr>
              <td>{`{Doctor’s name}`}</td>
              <td>{`{Invoice number}`}</td>
            </tr>
          </table>
        </Row>
      </div>

      <div style={{ marginTop: 15 }}>
        <div>
          <h3 className="title">Final Charges Summary</h3>
        </div>
        <div>
          <CustomTableHTML data={finalChargeMockData} />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div>
          <h3 className="title">{`{Pet’s Name} Visit Summary`}</h3>
        </div>

        <div>
          <Row>
            <b>{`{Pet’s Name} `}</b> was seen today for{' '}
            <b>{` {Select Complaint Duration}`}</b>
          </Row>
          <Row>
            <b>{`{Reason for Consultation} `}</b>, based on the following
            complaints: <b>{`  {Chief Complaint}`}</b>
          </Row>
        </div>

        <div style={{ marginTop: 15 }}>
          <p>
            We have concluded that <b>{`{ Pet’s Name}`}</b> has the following
            based on the test results we conducted:
          </p>
        </div>
      </div>

      <div>
        <CustomTableHTML data={diagnosisMockData} />
      </div>

      <div style={{ marginTop: 15 }}>
        <div>
          <h3>
            <strong>Test Result</strong>
          </h3>
        </div>
        <div>
          <CustomTableHTML data={testResultMockData} />
        </div>
      </div>

      <div style={{ marginTop: 15, width: '80%' }}>
        <p>
          We know that it’s not always fun for <b>{`{Pet’s Name}`}</b> to visit
          us at the clinic no matter how excited we are to see{' '}
          <b>{`{her/him}`}</b>. Because of that, we made sure to give extra
          hugs, kisses, and treats to make <b>{`{her/his}`}</b> visit more
          comfortable. <b>{`{Pet’s Name}`}</b> did very well today and we
          formulated some special recommendations for home.{' '}
        </p>
      </div>

      <div>
        <h3 className="title">Care Plan</h3>
      </div>

      <div>
        <p>
          Based on today’s exam and the final diagnosis, we’d like to get{' '}
          <b>{`{Pet’s Name}`}</b> on the following care plan:
        </p>
      </div>

      <div>
        <CustomTableHTML data={carePlanMockData} />
      </div>

      <div style={{ marginTop: 15, width: '80%' }}>
        <div>
          <h3 className="title">Additional Care Recommendations</h3>
        </div>
        <div>
          <p>
            This is a text field, or a template field where a veterinarian can
            freely type a summary of a patient’s visit, or they can build a
            template for each service they choose to.{' '}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 15, width: '80%' }}>
        <div>
          <h3 className="title">Reminders</h3>
        </div>
        <div>
          <p>{`{Reminders}`}</p>
        </div>
      </div>

      <div style={{ marginTop: 15, width: '80%' }}>
        <div>
          <h3 className="title">Full Exam Summary</h3>
        </div>
        <div>
          <Row>
            We have noted the following for <b>{`{Pet’s Name}`} </b>
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> HAS or HAS NOT traveled outside of the
            country.{' '}
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> is or IS NOT coughing.{' '}
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> is or IS NOT sneezing.{' '}
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> is or IS NOT vomiting.{' '}
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> DOES or DOES NOT have diarrhea.{' '}
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> has NORMAL or ABNORMAL water intake.{' '}
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> has NORMAL or ABNORMAL appetite.{' '}
          </Row>
          <Row>
            <b>{`{Pet’s Name} `} </b> has the following special diets:
            <b>{`{Special Diets} `} </b>
          </Row>
        </div>

        <div style={{ marginTop: 15, width: '80%' }}>
          <p>
            All vitals were captured and a physical exam was conducted to
            further evaluate <b>{`{Pet’s Name}`} </b>.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 20, width: '80%' }}>
        <div>
          <h3 className="title">Vitals</h3>
        </div>
        <div>
          <Row>
            <b>{`{Temp} `} </b>{' '}
          </Row>
          <Row>
            <b>{`{Respiratory Rate} `} </b>
          </Row>
          <Row>
            <b>{`{Heart Rate} `} </b>
          </Row>
          <Row>
            <b>{`{Weight} `} </b>
          </Row>
          <Row>
            <b>{`{Body Score} `} </b>
          </Row>
        </div>
      </div>

      <div style={{ marginTop: 25, width: '80%' }}>
        <PhysicalExamHTML data={physicalExamMockData} />
      </div>
    </div>
  );
};

export default FinalSummaryHTML;
