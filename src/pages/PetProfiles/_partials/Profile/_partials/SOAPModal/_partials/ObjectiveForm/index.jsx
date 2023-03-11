import React, { useState, useContext } from 'react';

// third-party libraries
import { useQuery, useMutation } from 'react-query';
import {
  Form,
  Col,
  Switch,
  Row,
  Slider,
  Button,
  Input,
  Skeleton,
  notification,
} from 'antd';
import { useHistory, useParams } from 'react-router-dom';

// API Client
import api from 'api';

// components
import IssueList from './_partials/IssueList';
import TextAreaWithMic from 'components/TextAreaWithMic';
import FormItemIcon from 'pages/KnowledgeBase/_partials/FormItemIcon';
import { PetProfileContext } from 'pages/PetProfiles/_partials/Profile/context';

// utils
import isEmpty from 'utils/isEmpty';
import { convertUnixDate } from 'utils/convertDataString';
import useSearchQuery from 'utils/useSearchQuery';

// styles
import './index.less';

const ObjectiveForm = () => {
  const {
    soapUIData: { subjectiveData, objectiveData },
    objectiveSubmitMutation,
    isSavingObjectiveData,
    setSoapUIData,
    // petId,
  } = useContext(PetProfileContext);

  const [objectiveForm] = Form.useForm();
  const query = useSearchQuery();
  const { petId } = useParams();
  const history = useHistory();
  const objectiveId = query.get('objectiveId');

  const [physcialExamination, setPhyscialExamination] = useState({});

  const getObjectiveData = useQuery(
    '',
    () => api.visitation.getObjectiveData(objectiveData?.id || objectiveId),
    {
      onSuccess(data) {
        if (!isEmpty(data?.data?.objective_note)) {
          const clonedCategories = {};

          Object.keys(data.data.objective_note?.clinic_examinations).map(
            (category) => {
              clonedCategories[`${category}`] =
                !data.data.objective_note?.clinic_examinations[`${category}`]
                  .issues?.length;
            },
          );
          objectiveForm.setFieldsValue({
            ...clonedCategories,
            medical_history_notes:
              data.data.objective_note?.medical_history_notes,
            body_score: data.data.objective_note?.body_score || 0,
          });

          setPhyscialExamination({
            ...data.data.objective_note?.clinic_examinations,
          });
        }
      },
      enabled: !!objectiveData?.id,
    },
  );

  const { data: clinicExamsData, isLoading: isLoadingClinicExams } = useQuery(
    'clinic-exams',
    () => api.clinic.getClinicExaminationV2(),
    {
      onSuccess(data) {
        const localCategoryObj = Object.create(physcialExamination);

        Object.keys(data?.data?.differential || {}).map((category) => {
          localCategoryObj[`${category}`] = {
            category,
            issues: [],
            comment: '',
            status: true,
          };

          return localCategoryObj;
        });
        setPhyscialExamination(localCategoryObj);
        if (objectiveData?.id || objectiveId) {
          getObjectiveData.refetch();
        }
      },
    },
  );

  const { data: petVisitData, isLoading: isLoadingPetVisitData } = useQuery(
    'pet-visit-history',
    () => api.visitation.getAllVisitaionsByPet(petId),
    {
      enabled: petId && true,
    },
  );
  const updateObjectiveData = useMutation(
    (objectiveData) => api.visitation.updateObjectiveData(objectiveData),
    {
      onSuccess: (data) => {
        setSoapUIData((prvState) => ({
          ...prvState,
          objectiveData: {
            ...prvState?.objectiveData,
            ...data?.data?.objective_note,
          },
        }));
        history.push({
          search: `?soap=assessment&visitId=${subjectiveData?.subjective_note?.visitation_id}`,
        });
      },
      onError: (error) => {
        notification.error({
          message: 'Submit Subjective Data Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleSubmit = (formValues) => {
    const payload = {
      visitId:
        subjectiveData?.subjective_note?.visitation_id || query.get('visitId'),
      body_score: `${formValues.body_score}`,
      medical_history_notes: formValues.medical_history_notes || '',
      clinic_examinations: {
        ...physcialExamination,
      },
    };
    objectiveData && objectiveData.id
      ? updateObjectiveData.mutate({
          id: objectiveData.id,
          data: {
            obj_visit_id:
              subjectiveData?.subjective_note?.visitation_id ||
              query.get('visitId'),
            body_score: payload.body_score,
            medical_history_notes: payload.medical_history_notes,
            clinic_examinations: payload.clinic_examinations,
          },
        })
      : objectiveSubmitMutation(payload);
  };

  const handleValueChange = (category, type, value) => {
    //when click in normal option delete the issues and comment
    if (value === true && type === 'status') {
      setPhyscialExamination((prvState) => ({
        ...prvState,
        [category]: {
          ...prvState[category],
          issues: [],
          comment: '',
        },
      }));
    }

    setPhyscialExamination((prvState) => ({
      ...prvState,
      [category]: {
        ...prvState[category],
        [type]: value,
      },
    }));
  };

  const navigateBack = () => {
    history.push({
      search: `?soap=subjective&subjectiveId=${subjectiveData?.subjective_note?.id}&visitId=${subjectiveData?.subjective_note?.visitation_id}`,
    });
  };

  return (
    <div id="objective-form-wrapper">
      {getObjectiveData.isLoading || getObjectiveData.isFetching ? (
        <Skeleton active />
      ) : (
        <>
          <h4>Physical Examination</h4>
          <Form layout="vertical" form={objectiveForm} onFinish={handleSubmit}>
            <Row gutter={30}>
              <Col span={24}>
                <h4>
                  <FormItemIcon /> Examination
                </h4>
              </Col>
              <Col span={11}>
                <div>
                  {Object.keys(clinicExamsData?.data?.differential || {}).map(
                    (category) => (
                      <>
                        <Form.Item
                          name={`${category}`}
                          label={`${category}`}
                          className="switch-form-item-wrapper"
                          valuePropName="checked"
                        >
                          <Switch
                            unCheckedChildren="Abnormal"
                            onChange={(value) =>
                              handleValueChange(`${category}`, 'status', value)
                            }
                            checkedChildren="Normal"
                            defaultChecked
                          />
                        </Form.Item>
                        {!physcialExamination[`${category}`]?.status && (
                          <>
                            <IssueList
                              issueList={
                                clinicExamsData?.data?.differential[
                                  `${category}`
                                ]
                              }
                              isLoadingIssues={isLoadingClinicExams}
                              issueType={`${category}`}
                              onValueChange={handleValueChange}
                              defaultValue={
                                physcialExamination[`${category}`]?.issues
                              }
                            />
                            <TextAreaWithMic
                              form={objectiveForm}
                              name={`${category}_comment`}
                              required={false}
                              onChange={(value) => {
                                handleValueChange(
                                  `${category}`,
                                  'comment',
                                  value?.target?.value,
                                );
                              }}
                              value={
                                physcialExamination[`${category}`]?.comment
                              }
                            />
                          </>
                        )}
                      </>
                    ),
                  )}
                </div>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={24}>
                <h4>
                  <FormItemIcon /> Body Score
                </h4>
              </Col>
              <Col span={11}>
                <Form.Item name="body_score">
                  <Slider
                    min={1}
                    style={{ marginLeft: 30 }}
                    max={9}
                    marks={{
                      1: 'Too Thin',
                      4: 'Ideal',
                      6: 'Too Heavy',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col span={24}>
                <h4>
                  <FormItemIcon /> Past Medical History
                </h4>
              </Col>
              <Col span={12}>
                <ul className="medical-history-list">
                  {petVisitData?.data?.pet_visit_history?.map((item) => (
                    <li key={item.created_at}>
                      {convertUnixDate(item.created_at)}
                    </li>
                  ))}

                  {isLoadingPetVisitData && <li>loading...</li>}
                </ul>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={24}>
                <h4>
                  <FormItemIcon /> Note on Medical History
                </h4>
              </Col>
              <Col span={24}>
                <TextAreaWithMic
                  form={objectiveForm}
                  name={'medical_history_notes'}
                  required={false}
                  value={objectiveForm.getFieldValue('medical_history_notes')}
                />
              </Col>
            </Row>
            <Row justify="center">
              <Col span={4}>
                <Button size="large" shape="round" onClick={navigateBack}>
                  Previous
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  htmlType="submit"
                  loading={
                    isSavingObjectiveData || updateObjectiveData.isLoading
                  }
                >
                  Continue
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </div>
  );
};

export default ObjectiveForm;
