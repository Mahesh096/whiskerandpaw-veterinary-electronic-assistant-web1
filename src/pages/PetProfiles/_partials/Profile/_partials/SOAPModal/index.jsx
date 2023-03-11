import React, { useContext } from 'react';

// third-party libraries
import { Steps, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

// components
import SuccessPage from './_partials/SuccessPage';
import { PetProfileContext } from 'pages/PetProfiles/_partials/Profile/context';
import ObjectiveForm from './_partials/ObjectiveForm';
import SubjectiveForm from './_partials/SubjectiveForm';
import TreatmentPlan from './_partials/TreatmentPlan';
import ResultPageModal from '../ResultPageModal';

// utils
import useSearchQuery from 'utils/useSearchQuery';

// styles
import './index.less';

const { Step } = Steps;

const SOAPModal = () => {
  const query = useSearchQuery();
  const soapProcess = query.get('soap');
  const history = useHistory();

  const {
    setCurrentSOAPScreen,
    showSOAPSuccessPage,
    setShowSOAPSuccessPage,
    setEditVisitData,
  } = useContext(PetProfileContext);

  const handleClose = (e) => {
    setCurrentSOAPScreen(0);
    setEditVisitData(null);
    setShowSOAPSuccessPage(false);
  };

  const steps = ['Subjective', 'Objective', 'Assessment & Plan', 'Results'];

  const getCurrentStep = () => {
    const step = steps
      .map((item, index) => {
        if (item.toLocaleLowerCase().includes(soapProcess.toLocaleLowerCase()))
          return index;
      })
      .filter(Boolean);

    return step?.length ? step[0] : 0;
  };

  const renderPage = () => {
    switch (soapProcess) {
      case 'subjective':
        return <SubjectiveForm />;
      case 'objective':
        return <ObjectiveForm />;
      case 'assessment':
        return <TreatmentPlan />;
      case 'assessment':
        return <TreatmentPlan />;
      case 'results':
        return <ResultPageModal />;
      default:
        return null;
    }
  };

  const renderStepsHeader = () => {
    return (
      <Steps current={getCurrentStep()}>
        {steps.map((item) => (
          <Step key={item} title={item} />
        ))}
      </Steps>
    );
  };

  return (
    <div className="soap">
      {showSOAPSuccessPage ? (
        <SuccessPage onClose={handleClose} />
      ) : (
        <>
          <Button
            type="dashed"
            shape="round"
            onClick={() => history.push({ search: '' })}
          >
            <LeftOutlined /> Back to pet info
          </Button>
          {renderStepsHeader()}
          {renderPage()}
        </>
      )}
    </div>
  );
};

export default SOAPModal;
