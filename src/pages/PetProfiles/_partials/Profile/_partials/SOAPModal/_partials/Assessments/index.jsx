// react libraries
import React, { useContext, useEffect, useState } from 'react';

import {
  Button,
  Row,
  Col,
  Spin,
  Table,
  Tooltip,
  Select,
  Popconfirm,
  Drawer,
  notification,
} from 'antd';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, BulbOutlined, DeleteOutlined } from '@ant-design/icons';

// components
import { AppStateContext } from 'AppContext';
import { PetProfileContext } from 'pages/PetProfiles/_partials/Profile/context';
import EditDiagnosisForm from 'components/EditDiagnosisForm';

// API Client
import api from 'api';

// styles
import './index.less';

const { Option } = Select;

const Assessments = () => {
  const [diagnosisDropDownData, setDiagnosisDropDown] = useState([]);
  const [recommendedData, setRecommendedData] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);
  const [diagnosisTableData, setDiagnosisTableData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDiagnosisData, setEditDiagnosisData] = useState(null);

  const { user } = useContext(AppStateContext);

  const {
    soapUIData: { objectiveData, assessmentData },
    prevSOAPScreen,
    getAIDiagnosisRecommendation,
    isFetchingAIRecommendation,
    petDetails,
    assessmentSubmitMutation,
    isSavingAssessmentData,
    setSoapUIData,
    nextSOAPScreen,
  } = useContext(PetProfileContext);

  const getExaminationValues = () => {
    const examinationData =
      objectiveData?.clinicExaminations || objectiveData?.clinic_examinations;

    return Object.keys(examinationData)
      .map((category) => ({
        category,
        names: examinationData[category].issues,
      }))
      .filter((value) => value?.names?.length);
  };

  useEffect(() => {
    if (
      objectiveData?.clinicExaminations ||
      objectiveData?.clinic_examinations
    ) {
      getAIDiagnosisRecommendation({
        differentials: [...getExaminationValues()],
      });
    }
  }, []);

  useEffect(() => {
    if (assessmentData?.recommendations) {
      setRecommendedData(() =>
        assessmentData?.recommendations.map((diagnosis) => ({
          ...diagnosis,
          ai: true,
        })),
      );
    }
  }, [assessmentData]);

  useEffect(() => {
    setDiagnosisTableData(
      diagnosisDropDownData?.filter((item) =>
        selectedDiagnosis.includes(item.name),
      ),
    );
  }, [selectedDiagnosis, diagnosisDropDownData]);

  const {
    isLoading: isFetchingDiagnosisData,
    refetch: reFetchAllDiagnosisData,
  } = useQuery('diagnosis', () => api.diagnosis.getAllDiagnosis(), {
    onSuccess(data) {
      if (data) setDiagnosisDropDown(data?.data?.diagnosis);
    },
  });

  const updateAssessmentData = useMutation(
    (assessmentData) => api.visitation.updateAssessmentData(assessmentData),
    {
      onSuccess: (data, variables) => {
        data;
        setSoapUIData((prvState) => ({
          ...prvState,
          objectiveData: {
            ...prvState?.assessmentData,
            ...variables,
          },
        }));

        nextSOAPScreen();
      },
      onError: (error) => {
        notification.error({
          message: 'Submit Subjective Data Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleEditButtonClick = (record) => {
    setShowEditModal(true);
    setEditDiagnosisData(record);
  };

  const handleCloseDiagnosisModal = () => {
    setShowEditModal(false);
    setEditDiagnosisData(null);
  };

  const handleEditDataDone = () => {
    reFetchAllDiagnosisData();

    getAIDiagnosisRecommendation({
      userId: user?.id,
      data: { queries: [...getExaminationValues().filter((item) => item)] },
    });
    handleCloseDiagnosisModal();
  };

  const handleRemoveItemfromTable = (itemName) => {
    const selectedItems = selectedDiagnosis.filter(
      (diaName) => diaName !== itemName,
    );
    setSelectedDiagnosis(() => selectedItems);

    const mutatedDiagnosis = recommendedData?.filter(
      (diagnosis) => diagnosis?.name !== itemName,
    );
    setRecommendedData(mutatedDiagnosis);
  };

  const baseDcolumns = [
    {
      title: '',
      fixed: 'left',
      width: 40,
      render: (text, record) =>
        record?.ai && (
          <Tooltip placement="topLeft" title={'🐾 VEA recommended'} key={text}>
            <BulbOutlined />
          </Tooltip>
        ),
    },
    {
      title: 'Diagnosis Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (category) => <span> {category || 'N/A'}</span>,
    },
    {
      title: 'Differentials',
      dataIndex: 'differentials',
      key: 'differentials',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: (differentials) => (
        <Tooltip placement="topLeft" title={differentials}>
          {differentials || 'N/A'}
        </Tooltip>
      ),
    },

    {
      title: 'Common Symptops',
      dataIndex: 'symptoms',
      key: 'symptoms',
      ellipsis: {
        showTitle: false,
      },
      render: (symptoms) => (
        <Tooltip placement="topLeft" title={symptoms}>
          {symptoms || 'N/A'}
        </Tooltip>
      ),
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address || 'N/A'}
        </Tooltip>
      ),
    },
  ];

  const userColumns = [
    ...baseDcolumns,
    {
      title: '',
      render: function Actions(record) {
        return (
          <>
            <Popconfirm
              title={`Are you sure to remove ${record?.name}`}
              onConfirm={() => handleRemoveItemfromTable(record?.name)}
              onCancel={() => {}}
              okText="Remove"
              cancelText="Cancel"
            >
              <Button type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
            <Popconfirm
              title={`Are you sure to edit ${record?.name}`}
              onConfirm={() => handleEditButtonClick(record)}
              onCancel={() => {}}
              okText="Edit"
              cancelText="Cancel"
            >
              <Button type="text" icon={<EditOutlined />} />
            </Popconfirm>
          </>
        );
      },
      fixed: 'right',
      width: 100,
    },
  ];

  const submitAssessmentData = () => {
    const payload = {
      petId: petDetails?.id,
      visitId: objectiveData?.obj_visit_id,
      diagnosis: [...(recommendedData || []), ...diagnosisTableData],
    };

    setSoapUIData((prvState) => ({
      ...prvState,
      assessmentData: {
        ...prvState.assessmentData,
        ...payload,
      },
    }));

    assessmentSubmitMutation(payload);
  };

  return (
    <div id="assessments-form-wrapper">
      {isFetchingAIRecommendation ? (
        <div style={{ textAlign: 'center' }}>
          <Spin tip="Chill a bit, we are getting you some AI Recommendations" />
        </div>
      ) : (
        <>
          <div className="custom-form-item-wrapper">
            <Row>
              <Col span={24}>
                <div className="list-container" style={{ marginTop: 30 }}>
                  <span className="primary-tag-outline">Diagnosis</span>
                  <div style={{ margin: 10 }}>
                    <Select
                      mode="multiple"
                      placeholder="Search and Add Diagnosis"
                      loading={isFetchingDiagnosisData}
                      onChange={setSelectedDiagnosis}
                      style={{ width: '100%', marginRight: 10 }}
                      value={selectedDiagnosis}
                      filterOption={(input, option) =>
                        option?.children
                          ?.toLowerCase()
                          ?.includes(input?.toLowerCase())
                      }
                      size="large"
                    >
                      {diagnosisDropDownData?.map((item) => (
                        <Option key={item.name} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Table
                      columns={userColumns}
                      dataSource={[
                        ...(recommendedData || []),
                        ...diagnosisTableData,
                      ]}
                      pagination={{ position: ['none', 'none'] }}
                      scroll={{ x: 1500 }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Row justify="center" style={{ marginTop: 30 }}>
            <Col span={4}>
              <Button size="large" shape="round" onClick={prevSOAPScreen}>
                Previous
              </Button>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                size="large"
                shape="round"
                onClick={submitAssessmentData}
                loading={
                  isSavingAssessmentData || updateAssessmentData.isLoading
                }
              >
                Continue
              </Button>
            </Col>
          </Row>
        </>
      )}

      <Drawer
        title={`Edit ${editDiagnosisData?.name}`}
        placement="right"
        onClose={handleCloseDiagnosisModal}
        visible={showEditModal}
        style={{ position: 'absolute' }}
        width={700}
      >
        <EditDiagnosisForm
          onEditDone={handleEditDataDone}
          editData={editDiagnosisData}
        />
      </Drawer>
    </div>
  );
};

export default Assessments;
