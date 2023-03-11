import React, { useContext, useEffect, useState } from 'react';

// third-party libraries
import {
  PageHeader,
  Button,
  Collapse,
  Skeleton,
  notification,
  Tag,
  Table,
  Tooltip,
  ConfigProvider,
  Empty,
} from 'antd';
import {
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  BookOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

// components
import PetInfo from './_partials/PetInfo';
import SOAPModal from './_partials/SOAPModal';
import { PetProfileStateProvider } from './context';
import PetVisitIcon from 'svg/pet-visit-panel-icon.svg';
import ResultPageModal from './_partials/ResultPageModal';
import StatusModal from './_partials/StatusModal';

// utils
import { sortBy } from 'utils/sort';
import useSearchQuery from 'utils/useSearchQuery';
import { convertUnixDate, convertUnixTime } from 'utils/convertDataString';
import { AppStateContext } from 'AppContext';

// API Client
import api from 'api';

// styles
import './index.less';

const { Panel } = Collapse;

const Profile = () => {
  const [editVisitData, setEditVisitData] = useState(null);
  const [currentSOAPScreen, setCurrentSOAPScreen] = useState(0);
  const [showSOAPSuccessPage, setShowSOAPSuccessPage] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState({
    visible: false,
    visitId: null,
  });
  const [showPageResultModal, setShowPageResultModal] = useState(false);
  const [visitResultData, setVisitResultData] = useState(null);

  const [soapUIData, setSoapUIData] = useState({
    subjectiveData: {},
    objectiveData: {},
    assessmentData: {},
    treatmentPlanData: {},
  });

  let history = useHistory();
  const { petId } = useParams();
  const query = useSearchQuery();

  const {
    data: petDetailsData,
    isLoading: isLoadingPetDetails,
    refetch: getPetDetails,
  } = useQuery('pet-details', () => api.pet.getPetDetails(petId), {
    enabled: !!Number(petId),
  });

  const soapProcess = query.get('soap');
  const visitId = query.get('visitId');

  useEffect(() => {
    if (visitId) {
      getVisitationDetailsById(visitId);
    }
  }, [visitId]);

  const { data: petParentData } = useQuery(
    'pet-parent',
    () =>
      api.petParents.getPetParentDetails(petDetailsData?.data?.pet?.parent_id),
    {
      enabled: !isLoadingPetDetails && true,
    },
  );

  // const { data: visitationsData, isLoading: isLoadingVisitations } = useQuery(
  //   'visitations',
  //   () => api.visitation.getAllVisitaions(),
  // );

  const { clinics } = useContext(AppStateContext);

  const { data: clinicData } = useQuery(
    'clinic-data',
    () => api.clinic.getClinicInfo(clinics[0].serialId),
    {
      enabled: petId && true,
    },
  );

  const petVisitsData = useQuery(
    'pet-visit-history',
    () => api.visitation.getAllVisitaionsByPet(petId),
    {
      enabled: petId && true,
      cacheTime: 0,
    },
  );

  const { data: statusData, isLoading: isFetchingStatus } = useQuery(
    'status',
    () => api.visitation.getVisitationStatus(),
  );

  const {
    mutate: subjectiveSubmitMutation,
    isLoading: isSavingSubjectiveData,
  } = useMutation(
    (subjectiveData) => api.visitation.saveSubjectiveData(subjectiveData),
    {
      onSuccess: (data, variables) => {
        setSoapUIData((prvState) => ({
          ...prvState,
          subjectiveData: {
            ...prvState.subjectiveData,
            ...variables,
            ...data?.data?.details,
          },
        }));

        history.push({
          search: `?soap=objective&visitId=${data?.data?.details?.subjective_note?.visitation_id}`,
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

  const {
    mutate: assessmentSubmitMutation,
    isLoading: isSavingAssessmentData,
  } = useMutation(
    (assessmentData) => api.visitation.saveAssessmentData(assessmentData),
    {
      onSuccess: () => {
        toggleSOAPSuccessPage();
      },
      onError: (error) => {
        notification.error({
          message: 'Submit Assessment Data Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const { mutate: objectiveSubmitMutation, isLoading: isSavingObjectiveData } =
    useMutation(
      (objectiveData) => api.visitation.saveObjectiveData(objectiveData),
      {
        onSuccess: (data, variables) => {
          setSoapUIData((prvState) => ({
            ...prvState,
            objectiveData: {
              ...variables,
              ...data?.data?.objectiveNotes,
            },
          }));

          history.push({ search: `?soap=assessment&visitId=${visitId}` });
        },
        onError: (error) => {
          notification.error({
            message: 'Submit Objective Data Error',
            description: `${error.response.data.message}`,
          });
        },
      },
    );

  const {
    mutate: getAIDiagnosisRecommendation,
    isLoading: isFetchingAIRecommendation,
  } = useMutation(
    (payload) => api.visitation.getAIDiagnosisRecommendation(payload),
    {
      onSuccess: (data) => {
        setSoapUIData((prvState) => ({
          ...prvState,
          assessmentData: {
            ...prvState.assessmentData,
            recommendations: data?.data?.diagnosis,
          },
        }));
      },
      onError: (error) => {
        notification.error({
          message: 'Fetch AI Diagnosis Recommendation Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const {
    mutate: getAITreatmentRecommendation,
    isLoading: isFetchingAITreatmentRecommendation,
  } = useMutation(
    (payload) => api.visitation.getAITreatmentRecommendation(payload),
    {
      onSuccess: (data) => {
        setSoapUIData((prvState) => ({
          ...prvState,
          treatmentPlanData: {
            ...prvState.treatmentPlanData,
            treatmentRecommendations: {
              ...data?.data,
            },
          },
        }));
      },
      onError: (error) => {
        notification.error({
          message: 'Fetch AI Treatment Recommendation Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const getAIRuleOutsRecommendation = useMutation(
    (payload) => api.visitation.getAIRuleOutsRecommendation(payload),
    {
      onSuccess: (data) => {
        setSoapUIData((prvState) => ({
          ...prvState,
          treatmentPlanData: {
            ...prvState.treatmentPlanData,
            ruleOutsRecommendations: {
              ...data?.data,
            },
          },
        }));
      },
      onError: (error) => {
        notification.error({
          message: 'Fetch AI Rule Outs Recommendation Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const {
    mutate: getAIMedicationRecommendation,
    isLoading: isFetchingAIMedicationRecommendation,
  } = useMutation(
    (payload) => api.visitation.getAIMedicationRecommendation(payload),
    {
      onSuccess: (data) => {
        setSoapUIData((prvState) => ({
          ...prvState,
          treatmentPlanData: {
            ...prvState.treatmentPlanData,
            medicationRecommendations: {
              ...data?.data,
            },
          },
        }));
      },
    },
  );

  const {
    mutate: getVisitationDetailsById,
    isLoading: isFetchVisitationDetails,
  } = useMutation(
    (visitId) => api.visitation.getAllVisitaionDetailsById(visitId),
    {
      onSuccess: (data) => {
        setSoapUIData((prvState) => ({
          ...prvState,
          objectiveData: data.data.visit_details.objective_notes,
          subjectiveData: {
            subjective_note: data.data.visit_details.subjective_notes,
          },
        }));
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );

  const handleFetchVisitationDetails = (visitData) => {
    history.push({
      search: `?soap=subjective&subjectiveId=${visitData?.subjective_note?.id}&visitId=${visitData?.visitation_id}`,
    });
    setEditVisitData(visitData);
    getVisitationDetailsById(visitData?.visitation_id);
  };

  const handlePageResult = (visitData) => {
    setVisitResultData(visitData);
    history.push({
      search: `?soap=results&visitId=${visitData?.visitation_id}&subjectiveId=${visitData?.subjective_note?.id}`,
    });
  };

  const handleSubjectiveDataSubmit = (formData) => {
    subjectiveSubmitMutation({ ...formData });
  };

  const toggleManageStatusModal = (visitId) => {
    setShowStatusModal((prvState) => ({
      visible: !prvState.visible,
      visitId: visitId || null,
    }));
  };

  const nextSOAPScreen = () => {
    setCurrentSOAPScreen(currentSOAPScreen + 1);
  };

  const prevSOAPScreen = () => {
    setCurrentSOAPScreen(currentSOAPScreen - 1);
  };

  const toggleSOAPSuccessPage = () => {
    setShowSOAPSuccessPage((prvState) => !prvState);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      ellipsis: true,
      render: (text) => <strong>{convertUnixDate(text)}</strong>,
    },
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      ellipsis: true,
      render: (text) => <strong>{convertUnixTime(text)}</strong>,
    },
    {
      title: 'Current Status',
      key: 'visit_status',
      dataIndex: 'visit_status',
      width: 100,
      ellipsis: true,
      render: (text) => (
        <>
          <Tag color={'green'}>{text?.toUpperCase()}</Tag>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => (
        <>
          <Button
            key={text}
            type="text"
            onClick={() => toggleManageStatusModal(record?.visitation_id)}
            icon={<InfoCircleOutlined />}
          />

          <Button danger type="text" icon={<DeleteOutlined />} />

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleFetchVisitationDetails(record)}
          />
          <Tooltip title="Result Page">
            <Button
              type="text"
              icon={<BookOutlined />}
              onClick={() => handlePageResult(record)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div id="pet-profile">
      <PetProfileStateProvider
        state={{
          soapUIData,
          isSavingSubjectiveData,
          handleSubjectiveDataSubmit,
          objectiveSubmitMutation,
          isSavingObjectiveData,
          petDetails: petDetailsData?.data?.pet,
          petParent: petParentData?.data?.petParent,
          clinicData: clinicData,
          nextSOAPScreen,
          prevSOAPScreen,
          getAIDiagnosisRecommendation,
          isFetchingAIRecommendation,
          isFetchVisitationDetails,
          setCurrentSOAPScreen,
          assessmentSubmitMutation,
          isSavingAssessmentData,
          setSoapUIData,
          getAITreatmentRecommendation,
          isFetchingAITreatmentRecommendation,
          showSOAPSuccessPage,
          toggleSOAPSuccessPage,
          setShowSOAPSuccessPage,
          getAIMedicationRecommendation,
          isFetchingAIMedicationRecommendation,
          statusData,
          isFetchingStatus,
          petId,
          editVisitData,
          setEditVisitData,
          getAIRuleOutsRecommendation,
          visitData: visitResultData,
        }}
      >
        {!soapProcess ? (
          <>
            <PageHeader
              subTitle={
                <span onClick={() => history.goBack()}>
                  <LeftOutlined /> Back
                </span>
              }
            />

            {isLoadingPetDetails ? (
              <Skeleton active />
            ) : (
              <div>
                <PetInfo
                  petDetails={petDetailsData ? petDetailsData.data.pet : {}}
                  getPetDetails={getPetDetails}
                />
              </div>
            )}

            <div className="profile-visit-details-container">
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (
                  <RightOutlined rotate={isActive ? 90 : 0} />
                )}
                className="site-collapse-custom-collapse"
                expandIconPosition={'right'}
              >
                <Panel
                  header={
                    <div className="custom-panel-title-container">
                      <span>
                        <img
                          src={PetVisitIcon}
                          alt=""
                          style={{ width: 24, height: 24, marginRight: 10 }}
                        />
                      </span>
                      <span>Pet Visit History</span>
                    </div>
                  }
                  key="1"
                  className=""
                >
                  {petVisitsData.isLoading || petVisitsData.isFetching ? (
                    <Skeleton active />
                  ) : (
                    <ConfigProvider
                      renderEmpty={() => (
                        <Empty
                          description={
                            "This fur baby doesn't have any visits yet. Get started by clicking: Add New Visit"
                          }
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    >
                      <Table
                        columns={columns}
                        dataSource={sortBy(
                          petVisitsData?.data &&
                            petVisitsData?.data?.data?.pet_visit_history,
                          {
                            prop: 'created_at',
                            desc: true,
                          },
                        )}
                      />
                    </ConfigProvider>
                  )}
                </Panel>
              </Collapse>
            </div>

            {showStatusModal.visible && (
              <StatusModal
                onCancel={toggleManageStatusModal}
                visible={showStatusModal.visible}
                visitId={showStatusModal.visitId}
              />
            )}
          </>
        ) : (
          <SOAPModal />
        )}
      </PetProfileStateProvider>
    </div>
  );
};

export default Profile;
