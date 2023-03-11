import React, { useContext, useEffect, useState } from 'react';

// third-party libraries
import {
  Form,
  Col,
  Row,
  Input,
  Button,
  Select,
  Radio,
  notification,
  Skeleton,
  Collapse,
  InputNumber,
} from 'antd';

import { useQuery, useMutation } from 'react-query';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

// components
import FormItemIcon from 'pages/KnowledgeBase/_partials/FormItemIcon';
import { PetProfileContext } from 'pages/PetProfiles/_partials/Profile/context';
import { AppStateContext } from 'AppContext';
import TextAreaWithMic from 'components/TextAreaWithMic';
import { CustomInput } from 'components/CustomInput';

// utils
import useSearchQuery from 'utils/useSearchQuery';

// API Client
import api from 'api';
import { formatNumberToTwoDecimal } from './utils';

const { Option } = Select;
const { Panel } = Collapse;

const SubjectiveForm = () => {
  const [subjectiveForm] = Form.useForm();
  let history = useHistory();
  const query = useSearchQuery();
  const [fieldDict, setFieldDict] = useState(null);

  const [petVitals, setPetVitals] = useState({
    temp: 'fahrenheit',
    weight: 'lbs',
    heart_rate: 'bps',
    respiratory_rate: 'bps',
  });
  const [reasonForConsultation, setReasonForConsultation] = useState({
    diarrhoea: '',
    vomiting: '',
  });

  const [mainCaseValue, setMainCaseValue] = useState(0);

  const {
    petDetails,
    isSavingSubjectiveData,
    handleSubjectiveDataSubmit,
    editVisitData,
    soapUIData,
    setSoapUIData,
  } = useContext(PetProfileContext);

  const { clinics } = useContext(AppStateContext);

  const subjectiveId = query.get('subjectiveId');

  const handPetVitalsValueChange = (value, type) => {
    setPetVitals((prvState) => ({ ...prvState, [type]: value }));
  };

  useEffect(() => {
    if (Number(subjectiveId)) {
      getSubjectiveData.refetch();
    }
  }, []);

  const { data: cases, isLoading: isLoadingCases } = useQuery('cases', () =>
    api.differentials.getSOAPCases(),
  );

  const getSubjectiveData = useQuery(
    '',
    () => api.visitation.getSubjectiveData(subjectiveId),
    {
      onSuccess(data) {
        if (editVisitData?.subjective_note?.id) {
          setSoapUIData((prvState) => ({
            ...prvState,
            subjectiveData: {
              ...data?.data,
            },
          }));
        }
        if (data?.data.subjective_note) {
          subjectiveForm.setFieldsValue({
            complaint: data?.data.subjective_note?.chief_complaint?.complaint,
            duration: data?.data.subjective_note?.chief_complaint?.duration,
            main_case:
              data?.data.subjective_note?.reason_for_consultation?.main_case,
            diarrhoea:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                .diarrhoea,
            skin_case:
              data?.data.subjective_note?.reason_for_consultation?.skin_case,
            general_health:
              data?.data.subjective_note?.reason_for_consultation
                ?.general_health,
            travel: data?.data.subjective_note?.additional_notes?.travel,
            coughing: data?.data.subjective_note?.additional_notes?.coughing,
            sneezing: data?.data.subjective_note?.additional_notes?.sneezing,
            vomiting:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .vomiting,
            diarrhea: data?.data.subjective_note?.additional_notes?.diarrhea,
            water_intake:
              data?.data.subjective_note?.additional_notes?.water_intake,
            appetite: data?.data.subjective_note?.additional_notes?.appetite,
            special_diets:
              data?.data.subjective_note?.additional_notes?.special_diets,
            reminders: data?.data.subjective_note?.additional_notes?.reminders,
            additional_vomiting:
              data?.data.subjective_note?.additional_notes?.vomiting,
            temp: data?.data.subjective_note?.vitals?.temperature?.value || 0,
            weight: data?.data.subjective_note?.vitals?.weight?.value || 0,
            respiratory_rate:
              data?.data.subjective_note?.vitals?.respiratory_rate?.value || 0,
            heart_rate:
              data?.data.subjective_note?.vitals?.heart_rate?.value || 0,
            //Diarrhoea
            times_diarrhoea:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                ?.times_diarrhoea,
            eating_stool:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                ?.eating_stool,
            diet_indiscretions:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                ?.diet_indiscretions,
            missing_toys:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                ?.missing_toys,
            accidents:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                ?.accidents,
            some_visit:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                ?.some_visit,
            pet_acting:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                ?.pet_acting,
            //Vomiting
            times_vomiting:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .times_vomiting,
            into_trash:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .into_trash,
            ate_something:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .ate_something,
            rat_poison:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .rat_poison,
            diet_changes:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .diet_changes,
            recently_vaccinated:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .recently_vaccinated,
          });

          setReasonForConsultation({
            diarrhoea:
              data?.data.subjective_note?.reason_for_consultation?.diarrhoea
                .diarrhoea,
            vomiting:
              data?.data.subjective_note?.reason_for_consultation?.vomiting
                .vomiting,
          });
          if (data?.data.subjective_note?.vitals) {
            setPetVitals({
              temp: data?.data.subjective_note?.vitals?.temperature?.unit,
              weight: data?.data.subjective_note?.vitals?.weight?.unit,
              respiratory_rate:
                data?.data.subjective_note?.vitals?.respiratory_rate?.unit,
              heart_rate: data?.data.subjective_note?.vitals?.heart_rate?.unit,
            });
          }
        }
      },
      enabled: !!editVisitData,
    },
  );

  const updateSubjectiveData = useMutation(
    (subjectiveData) => api.visitation.updateSubjectiveData(subjectiveData),
    {
      onSuccess: (data, variables) => {
        history.push({
          search: `?soap=objective&visitId=${
            variables?.data?.visit_id
          }&objectiveId=${soapUIData?.objectiveData?.id || ''}`,
        });

        setSoapUIData((prvState) => ({
          ...prvState,
          subjectiveData: {
            ...prvState.subjectiveData,
            ...variables?.data,
          },
        }));
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
      petId: petDetails?.id,
      clinicId: clinics[0]?.id,
      subjective_note: {
        chief_complaint: {
          complaint: formValues.complaint,
          duration: formValues.duration,
        },
        reason_for_consultation: {
          main_case: formValues.main_case,
          diarrhoea: {
            diarrhoea: formValues.diarrhoea,
            times_diarrhoea: reasonForConsultation.diarrhoea
              ? formValues.times_diarrhoea
              : '',
            eating_stool: reasonForConsultation.diarrhoea
              ? formValues.eating_stool
              : '',
            diet_indiscretions: reasonForConsultation.diarrhoea
              ? formValues.diet_indiscretions
              : '',
            missing_toys: reasonForConsultation.diarrhoea
              ? formValues.missing_toys
              : '',
            accidents: reasonForConsultation.diarrhoea
              ? formValues.accidents
              : '',
            some_visit: reasonForConsultation.diarrhoea
              ? formValues.some_visit
              : '',
            pet_acting: reasonForConsultation.diarrhoea
              ? formValues.pet_acting
              : '',
          },
          general_health: formValues.general_health,
          skin_case: formValues.skin_case,
          vomiting: {
            vomiting: formValues.vomiting,
            times_vomiting: reasonForConsultation.vomiting
              ? formValues.times_vomiting
              : '',
            into_trash: reasonForConsultation.vomiting
              ? formValues.into_trash
              : '',
            ate_something: reasonForConsultation.vomiting
              ? formValues.ate_something
              : '',
            rat_poison: reasonForConsultation.vomiting
              ? formValues.rat_poison
              : '',
            diet_changes: reasonForConsultation.vomiting
              ? formValues.diet_changes
              : '',
            recently_vaccinated: reasonForConsultation.vomiting
              ? formValues.recently_vaccinated
              : '',
          },
        },
        additional_notes: {
          water_intake: formValues.water_intake,
          travel: formValues.travel,
          coughing: formValues.coughing,
          sneezing: formValues.sneezing,
          vomiting: formValues.vomiting,
          diarrhea: formValues.diarrhea,
          appetite: formValues.appetite,
          special_diets: formValues.special_diets,
          reminders: formValues.reminders,
        },
        pet_vitals: {
          weight: {
            value: parseInt(formValues.weight) || 0,
            unit: petVitals.weight,
          },
          temperature: {
            value: parseInt(formValues.temp) || 0,
            unit: petVitals.temp,
          },
          heart_rate: {
            value: parseInt(formValues.heart_rate) || 0,
            unit: petVitals.heart_rate,
          },
          respiratory_rate: {
            value: parseInt(formValues.respiratory_rate) || 0,
            unit: petVitals.respiratory_rate,
          },
        },
      },
    };
    if (!soapUIData?.subjectiveData?.subjective_note?.id) {
      handleSubjectiveDataSubmit(payload);
    } else {
      updateSubjectiveData.mutate({
        id: soapUIData?.subjectiveData?.subjective_note?.id,
        data: {
          visit_id: soapUIData?.subjectiveData?.subjective_note?.visitation_id,
          chief_complaint: payload.subjective_note.chief_complaint,
          reason_for_consultation:
            payload.subjective_note.reason_for_consultation,
          additional_notes: payload.subjective_note.additional_notes, // changed
          vitals: {
            heart_rate: payload.subjective_note.pet_vitals.heart_rate,
            respiratory_rate:
              payload.subjective_note.pet_vitals.respiratory_rate,
            temperature: payload.subjective_note.pet_vitals.temperature,
            weight: payload.subjective_note.pet_vitals.weight,
          },
        },
      });
    }
    //   setSoapUIData({ ...soapUIData, subjectiveData: payload });
  };

  const durations = [
    'Acute',
    'Gradual',
    'Progressive',
    'Progressing',
    'Static',
    'Worsening',
  ];

  const showMainCaseDetails = (mainCase) => {
    return Array.isArray(mainCaseValue)
      ? mainCaseValue?.includes(mainCase)
      : mainCaseValue == mainCase;
  };

  return (
    <>
      {getSubjectiveData.isLoading ? (
        <Skeleton active />
      ) : (
        <div id="subjective-form-wrapper">
          <h4>Nurse Notes</h4>
          <Form layout="vertical" form={subjectiveForm} onFinish={handleSubmit}>
            <Row>
              <Col span={24}>
                <TextAreaWithMic
                  form={subjectiveForm}
                  name={'complaint'}
                  required={false}
                  autoSize={{ minRows: 4, maxRows: 7 }}
                  value={subjectiveForm.getFieldValue('complaint')}
                />
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={24}>
                <h4>
                  {' '}
                  <FormItemIcon /> Select Complaint Duration
                </h4>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="duration"
                  rules={[
                    { required: true, message: `Select complaint duration` },
                  ]}
                >
                  <Select
                    className="custom-select"
                    size="large"
                    style={{ width: '100%' }}
                  >
                    {durations.map((value) => (
                      <Option key={value}>{value}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={24}>
                <h4>
                  <FormItemIcon /> Reseason for Consultation
                </h4>
              </Col>

              <Col span={10}>
                <Form.Item label="" name="main_case" required={false}>
                  <Select
                    size="large"
                    placeholder="Select case"
                    loading={isLoadingCases}
                    onChange={(value) => setMainCaseValue(value)}
                    mode="tags"
                  >
                    {cases &&
                      cases?.data?.main_categories?.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12}>
                <div>
                  {/*Questions*/}
                  {showMainCaseDetails(4) && (
                    <Collapse
                      defaultActiveKey={['1']}
                      ghost
                      style={{ marginBottom: 30 }}
                    >
                      <Panel header="Questions about this issue" key="1">
                        <Form.Item
                          name="times_diarrhoea"
                          label="How long has the diarrhea been going on/progression"
                        >
                          <CustomInput size="large" type="text" />
                        </Form.Item>
                        <Form.Item
                          name="eating_stool"
                          label="Is the pet eating its stool?"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item
                          name="diet_indiscretions"
                          label="Diet indiscretions/changes/toxins/raw diet?"
                          className="ant ant-select-xs"
                        >
                          <Select>
                            <Option value="Normal">Normal</Option>
                            <Option value="Abnormal">Abnormal</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="missing_toys"
                          label="Missing toys/bones"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item
                          name="accidents"
                          label="Is pet having accidents in the house"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item
                          name="some_visit"
                          label="Does pet visit beaches/parks etc.?"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item
                          name="pet_acting"
                          label="pet acting normal/abnormal activity level"
                          className="ant ant-select-xs"
                        >
                          <Select>
                            <Option value="Normal">Normal</Option>
                            <Option value="Abnormal">Abnormal</Option>
                          </Select>
                        </Form.Item>
                      </Panel>
                    </Collapse>
                  )}

                  {showMainCaseDetails(3) && (
                    <Collapse
                      defaultActiveKey={['1']}
                      ghost
                      style={{ marginBottom: 30 }}
                    >
                      <Panel header="Questions about this issue" key="1">
                        <Form.Item
                          name="times_vomiting"
                          label="How many times did the pet vomit"
                        >
                          <CustomInput size="large" type="text" />
                        </Form.Item>

                        <Form.Item
                          name="into_trash"
                          label="Did pet get into the trash?"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item
                          name="ate_something"
                          label="Did the pet chew up a toy, eat a rock, chicken bone, beef bone, rawhide, bullystick, ect.?"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item
                          name="rat_poison"
                          label="Did the pet get into rat poison, snell bait any other toxins"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item
                          name="diet_changes"
                          label="Diet indiscretions/changes/toxins/raw diet?"
                          className="ant ant-select-xs"
                        >
                          <Select>
                            <Option value="Normal">Normal</Option>
                            <Option value="Abnormal">Abnormal</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="recently_vaccinated"
                          label="Was the pet recently vaccinated?"
                          className="switch-form-item-wrapper"
                        >
                          <Radio.Group>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Panel>
                    </Collapse>
                  )}
                </div>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={24}>
                <h4>
                  <FormItemIcon /> Additional Notes
                </h4>
              </Col>
              <Col span={11}>
                <div>
                  <Form.Item
                    name="travel"
                    label="Has the pet travelled outside the country?"
                    className="switch-form-item-wrapper"
                    initialValue={false}
                  >
                    <Radio.Group>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="coughing"
                    label="Coughing?"
                    className="switch-form-item-wrapper"
                    initialValue={false}
                  >
                    <Radio.Group>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="sneezing"
                    label="Sneezing?"
                    className="switch-form-item-wrapper"
                    initialValue={false}
                  >
                    <Radio.Group>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="additional_vomiting"
                    label="Vomiting?"
                    className="switch-form-item-wrapper"
                    initialValue={false}
                  >
                    <Radio.Group>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="diarrhea"
                    className="switch-form-item-wrapper"
                    label="Diarrhea?"
                    initialValue={false}
                  >
                    <Radio.Group>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Form.Item
                    name="water_intake"
                    label="Water Intake:"
                    className="switch-form-item-wrapper"
                    initialValue={true}
                  >
                    <Radio.Group>
                      <Radio value={true}>Normal</Radio>
                      <Radio value={false}>Abnormal</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="appetite"
                    className="switch-form-item-wrapper"
                    label="Appetite:"
                    initialValue={true}
                  >
                    <Radio.Group>
                      <Radio value={true}>Normal</Radio>
                      <Radio value={false}>Abnormal</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={9}>
                <Form.Item
                  name="special_diets"
                  className="switch-form-item-wrapper"
                  label="Special Diets"
                >
                  <Input size={'large'} className="cis" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h4>Priliminary Vitals</h4>
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Form.Item
                  name="temp"
                  className="switch-form-item-wrapper"
                  label="Temp"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  rules={[
                    {
                      required: true,
                      message: `This is a required field, please provide a temperature`,
                    },
                  ]}
                >
                  <InputNumber
                    size={'large'}
                    className="cis"
                    type="number"
                    step={'000.00'}
                    addonAfter={<span>&#8457;&nbsp;&nbsp;</span>}
                    parser={(value) => formatNumberToTwoDecimal(value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Form.Item
                  name="respiratory_rate"
                  className="switch-form-item-wrapper"
                  label="Respiratory Rate"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  rules={[
                    {
                      required: true,
                      message: `This is a required field, please provide a respiratory rate`,
                    },
                  ]}
                >
                  <InputNumber
                    size={'large'}
                    className="cis"
                    type="number"
                    addonAfter="bps"
                    step={1}
                    precision={0}
                    min={0}
                    max={999}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Form.Item
                  name="heart_rate"
                  className="switch-form-item-wrapper"
                  label="Heart Rate"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  rules={[
                    {
                      required: true,
                      message: `This is a required field, please provide a heart rate`,
                    },
                  ]}
                >
                  <InputNumber
                    size={'large'}
                    type="number"
                    className="cis"
                    addonAfter="bps"
                    step={1}
                    precision={0}
                    min={0}
                    max={999}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Form.Item
                  name="weight"
                  className="switch-form-item-wrapper"
                  label="Weight"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  rules={[
                    {
                      required: true,
                      message: `This is a required field, please provide a weight`,
                    },
                  ]}
                >
                  <InputNumber
                    size={'large'}
                    className="cis"
                    type="number"
                    step={'000.00'}
                    parser={(value) => formatNumberToTwoDecimal(value)}
                    addonAfter={
                      <Select
                        defaultValue="lbs"
                        className="select-before"
                        onChange={(value) =>
                          handPetVitalsValueChange(value, 'weight')
                        }
                      >
                        <Option value="kilogram">kg</Option>
                        <Option value="lbs">lbs</Option>
                      </Select>
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h4>Reminders</h4>
              </Col>
              <Col span={24}>
                <TextAreaWithMic
                  form={subjectiveForm}
                  name={'reminders'}
                  required={false}
                  autoSize={{ minRows: 4, maxRows: 7 }}
                  field={fieldDict}
                  setField={setFieldDict}
                  value={subjectiveForm.getFieldValue('reminders')}
                />
              </Col>
            </Row>
            <Row justify="center">
              <Col span={4}>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  htmlType="submit"
                  loading={
                    isSavingSubjectiveData || updateSubjectiveData.isLoading
                  }
                >
                  Continue
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </>
  );
};

SubjectiveForm.propTypes = {
  showNextScreen: PropTypes.func.isRequired,
};

export default SubjectiveForm;
