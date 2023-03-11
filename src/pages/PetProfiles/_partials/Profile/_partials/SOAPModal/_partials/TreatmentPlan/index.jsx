// react libraries
import React, { useContext, useEffect, useState } from 'react';

// third-party libraries
import { Button, Row, Col, Spin, Drawer, Switch, notification } from 'antd';
import { useQuery, useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';

// components
import ApprovalPage from '../ApprovalPage';
import EditDiagnosisForm from 'components/EditDiagnosisForm';
import { CustomInputPassword } from 'components/CustomInput';
import EditMedicationsForm from 'components/EditMedicationForm';
import EditDiagnosticsForm from 'components/EditDiagnosticsForm';
import MedicationsTable from 'pages/PetProfiles/_partials/Profile/_partials/components/MedicationsTable';
import RuleOutsTable from 'pages/PetProfiles/_partials/Profile/_partials/components/RuleOutsTable';
import TreatmentsTable from 'pages/PetProfiles/_partials/Profile/_partials/components/TreatmentsTable';
import { PetProfileContext } from 'pages/PetProfiles/_partials/Profile/context';

// context
import { AppStateContext } from 'AppContext';

// utils
import useSearchQuery from 'utils/useSearchQuery';

// API Client
import api from 'api';

const TreatmentPlan = () => {
  const [treatmentDropDownData, setTreatmentDropDown] = useState([]);
  const [medicationsDropDownData, setMedicationDropDown] = useState([]);
  const [treatmentRecommededData, setTreatmentRecommendedData] = useState([]);
  const [ruleOutsRecommededData, setRuleOutsRecommendedData] = useState([]);
  const [diagnosisDropDownData, setDiagnosisDropDown] = useState([]);
  const [ruleOutsData, setRuleOutsData] = useState([]);

  const [selectedTreatment, setSelectedTreatment] = useState([]);
  const [selectedRuleOuts, setSelectedRuleOuts] = useState([]);

  const [selectedMedication, setSelectedMedication] = useState([]);
  const [medicationTableData, setMedicationTableData] = useState([]);
  const [medicationRecommendedData, setMedicationRecommededData] = useState([]);
  const [treatmentTableData, setTreatmentTableData] = useState([]);
  const [showEditMedicatonModal, setShowMedicationEditModal] = useState({
    visible: false,
    editData: null,
  });
  const [showEditDiagnosticsModal, setShowEditDiagnosticsModal] = useState({
    visible: false,
    editData: null,
  });
  const [showEditDiagnosisModal, setShowEditDiagnosisModal] = useState({
    visible: false,
    editData: null,
  });
  const [isClientAtClinic, setIsClientAtClinic] = useState(false);
  const [approvalPage, setApprovalPage] = useState(false);
  const history = useHistory();

  //const signatureRef = useRef(null);

  const { clinics } = useContext(AppStateContext);
  const query = useSearchQuery();

  const {
    petId,
    soapUIData: { objectiveData, treatmentPlanData, subjectiveData },
    isFetchingAITreatmentRecommendation,
    getAIMedicationRecommendation,
    isFetchingAIMedicationRecommendation,
    getAITreatmentRecommendation,
    toggleSOAPSuccessPage,
    getAIRuleOutsRecommendation,
    setSoapUIData,
  } = useContext(PetProfileContext);

  const mainCaseValue = !Array.isArray(
    subjectiveData?.subjective_note?.reason_for_consultation?.main_case,
  )
    ? [subjectiveData?.subjective_note?.reason_for_consultation?.main_case]
    : subjectiveData?.subjective_note?.reason_for_consultation?.main_case;

  const getExaminationValues = () => {
    const examinationData =
      objectiveData?.clinicExaminations || objectiveData?.clinic_examinations;

    return Object.keys(examinationData)
      .map((category) => examinationData[category].issues)
      .filter((value) => value?.length);
  };

  useEffect(() => {
    if (treatmentPlanData?.treatmentRecommendations?.treatments) {
      setTreatmentRecommendedData(
        treatmentPlanData?.treatmentRecommendations?.treatments.map(
          (treatment) => ({ ...treatment, ai: true }),
        ),
      );
      setTreatmentTableData(() =>
        treatmentPlanData?.treatmentRecommendations?.treatments.map(
          (treatment) => ({ ...treatment, ai: true }),
        ),
      );
    }
  }, [treatmentPlanData?.treatmentRecommendations?.treatments]);

  useEffect(() => {
    if (treatmentPlanData?.ruleOutsRecommendations?.results) {
      setRuleOutsRecommendedData(
        treatmentPlanData?.ruleOutsRecommendations?.results.map(
          (treatment) => ({ ...treatment, ai: true }),
        ),
      );
      setRuleOutsData(() =>
        treatmentPlanData?.ruleOutsRecommendations?.results.map(
          (treatment) => ({ ...treatment, ai: true }),
        ),
      );
    }
  }, [treatmentPlanData?.ruleOutsRecommendations?.results]);

  // Trigger when there's recommendation from user
  useEffect(() => {
    if (treatmentPlanData?.medicationRecommendations?.results) {
      setMedicationRecommededData(
        treatmentPlanData?.medicationRecommendations?.results?.map(
          (medication) => ({
            ...medication,
            ai: true,
            current_price_details:
              medication?.price_details && medication?.price_details[0],
          }),
        ),
      );

      setMedicationTableData(
        treatmentPlanData?.medicationRecommendations?.results?.map(
          (medication) => ({
            ...medication,
            ai: true,
            current_price_details:
              medication?.price_details && medication?.price_details[0],
          }),
        ),
      );
    }
  }, [treatmentPlanData?.medicationRecommendations?.results]);

  // Trigger when use select medication from dropdown
  useEffect(() => {
    setMedicationTableData(() => [
      ...medicationRecommendedData,
      ...medicationsDropDownData
        ?.filter((item) => selectedMedication.includes(item.product_name))
        ?.map((item) => ({
          ...item,
          current_price_details:
            item?.current_price_details || item?.price_details[0] || {},
        })),
    ]);
  }, [selectedMedication, medicationsDropDownData]);

  useEffect(() => {
    setTreatmentTableData(() => [
      ...treatmentRecommededData,
      ...treatmentDropDownData?.filter((item) =>
        selectedTreatment.includes(item.name),
      ),
    ]);
  }, [selectedTreatment, treatmentDropDownData, treatmentRecommededData]);

  useEffect(() => {
    if (subjectiveData?.subjective_note?.reason_for_consultation?.main_case) {
      getAIMedicationRecommendation({
        treatments: treatmentTableData.map((trt) => trt.id),
        main_case: mainCaseValue,
      });
    }
  }, [treatmentTableData?.length, subjectiveData]);

  useEffect(() => {
    const ruleOutsLocalData = [
      ...ruleOutsRecommededData,
      ...diagnosisDropDownData?.filter((item) =>
        selectedRuleOuts.includes(item.id),
      ),
    ];

    setRuleOutsData(() => ruleOutsLocalData);
  }, [selectedRuleOuts, diagnosisDropDownData, ruleOutsRecommededData]);

  const { isLoading: isFetchingDiagnosisData } = useQuery(
    'diagnosis',
    () => api.diagnosis.getAllDiagnosis(),
    {
      onSuccess(data) {
        if (data) setDiagnosisDropDown(data?.data?.diagnosis);
      },
    },
  );

  const {
    isLoading: isFetchingTreatmentData,
    refetch: reFetchAllTreatmentData,
  } = useQuery('treatment', () => api.treatment.getAllTreatments(), {
    onSuccess(data) {
      if (data) setTreatmentDropDown(data?.data?.treatments);
    },
  });

  const { isLoading: isFetchingMedicationData } = useQuery(
    'medications',
    () => api.medications.getAllMedications(),
    {
      onSuccess(data) {
        if (data) setMedicationDropDown(data?.data?.medications);
      },
    },
  );

  const getTreatmentPlanData = useQuery(
    'treatmentPlanData',
    () =>
      api.visitation.getTreatmentPlanData(
        subjectiveData?.subjective_note?.visitation_id || query.get('visitId'),
      ),
    {
      onSuccess(data) {
        if (data?.data?.pet_process?.process_data) {
          if (data?.data?.pet_process?.process_data?.treatments?.length) {
            setSoapUIData((prvState) => ({
              ...prvState,
              treatmentPlanData: {
                ...prvState.treatmentPlanData,
                treatmentRecommendations: {
                  treatments:
                    data?.data?.pet_process?.process_data?.process_data
                      ?.process_data?.treatments ||
                    data?.data?.pet_process?.process_data?.treatments,
                },
              },
            }));
          }

          if (data?.data?.pet_process?.process_data?.ruleOuts?.length) {
            setSoapUIData((prvState) => ({
              ...prvState,
              treatmentPlanData: {
                ...prvState.treatmentPlanData,
                ruleOutsRecommendations: {
                  results:
                    data?.data?.pet_process?.process_data?.process_data
                      ?.process_data?.ruleOuts ||
                    data?.data?.pet_process?.process_data?.ruleOuts,
                },
              },
            }));
          }

          if (data?.data?.pet_process?.process_data?.medications?.length) {
            setSoapUIData((prvState) => ({
              ...prvState,
              treatmentPlanData: {
                ...prvState.treatmentPlanData,
                medicationRecommendations: {
                  medications:
                    data?.data?.pet_process?.process_data?.process_data
                      ?.process_data.medications ||
                    data?.data?.pet_process?.process_data?.medications,
                },
              },
            }));
          }
        }

        if (!data?.data?.pet_process?.process_data) {
          if (
            objectiveData?.clinicExaminations ||
            objectiveData?.clinic_examinations
          ) {
            getAITreatmentRecommendation({
              differentials: getExaminationValues()?.flat(),
              main_case: mainCaseValue,
            });
          }

          if (
            objectiveData?.clinicExaminations ||
            objectiveData?.clinic_examinations
          ) {
            getAIRuleOutsRecommendation
              .mutateAsync({
                differentials: getExaminationValues()?.flat(),
                main_case: mainCaseValue,
              })
              .then((res) => {
                const medicationPayload = res?.data?.ruleouts?.map(
                  (ruleOut) => ruleOut?.id,
                );

                !!medicationPayload?.length &&
                  getAIMedicationRecommendation({
                    diagnosis_ids: medicationPayload,
                  });
              });
          }
        }
      },
    },
  );

  const editDiagnosticsMutation = useMutation(
    (medicationPayload) => api.treatment.editAdminTreatment(medicationPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Treatment has been successfully edited',
          description: `You just edited a treatment!`,
        });
        toggleEditTreatmentModal(false);
        reFetchAllTreatmentData();
      },
      onError: (error) => {
        notification.error({
          message: 'Edit Treatment Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const saveTreatmentPlanData = useMutation(
    (treatmentPlanDataPayload) =>
      api.visitation.saveTreatmentPlanData(treatmentPlanDataPayload),
    {
      onSuccess: () => {
        toggleSOAPSuccessPage();
      },
      onError: (error) => {
        notification.error({
          message: 'Save Treatment Plan Error',
          description: `${error.response.data.message}`,
          key: 'treatmentPlanError',
        });
      },
    },
  );

  const editTreatmentPlanData = useMutation(
    (treatmentPlanDataPayload) =>
      api.visitation.updateTreatmentPlanData(treatmentPlanDataPayload),
    {
      onSuccess: () => {
        toggleSOAPSuccessPage();
      },
      onError: (error) => {
        notification.error({
          message: 'Update Treatment Plan Error',
          description: `${error.response.data.message}`,
          key: 'treatmentPlanError',
        });
      },
    },
  );

  const handleSaveTreatmentPlanData = () => {
    const payload = {
      clinic_id: clinics[0].serialId,
      visit_id:
        subjectiveData?.subjective_note?.visitation_id || query.get('visitId'),
      pet_id: petId,
      process_data: {
        ruleOuts: ruleOutsData,
        treatments: treatmentTableData,
        medications: medicationTableData,
      },
    };

    const editPayload = {
      id: getTreatmentPlanData.data?.data?.pet_process?.id,
      process_data: {
        ruleOuts: ruleOutsData,
        treatments: treatmentTableData,
        medications: medicationTableData,
      },
    };

    if (getTreatmentPlanData.data?.data?.pet_process?.id) {
      editTreatmentPlanData.mutate(editPayload);
      return;
    }

    saveTreatmentPlanData.mutate(payload);
  };

  const toggleEditMedicationModal = (modalVisibilityState, medicationData) => {
    setShowMedicationEditModal({
      visible: modalVisibilityState,
      editData: medicationData || null,
    });
  };

  const handleRemoveItemfromMedicationsTable = (item) => {
    const mutatedMedications = medicationTableData?.filter(
      (med) => item?.product_name !== med?.product_name,
    );
    const mutatedRecommededMedications = medicationRecommendedData?.filter(
      (med) => item?.product_name !== med?.product_name,
    );
    const mutatedSelectedMedications = selectedMedication?.filter(
      (med) => item?.product_name !== med,
    );

    setMedicationTableData(mutatedMedications);
    setMedicationRecommededData(mutatedRecommededMedications);
    setSelectedMedication(mutatedSelectedMedications);
  };

  const handleRemoveItemfromTreatmentsTable = (item) => {
    const mutatedTreatments = treatmentTableData?.filter(
      (med) => item?.name !== med?.name,
    );

    const mutatedRecommededTreatments = treatmentRecommededData?.filter(
      (med) => item?.name !== med?.name,
    );
    const mutatedSelectedTreatments = selectedTreatment?.filter(
      (med) => item?.name !== med,
    );

    setTreatmentTableData(mutatedTreatments);
    setTreatmentRecommendedData(mutatedRecommededTreatments);
    setSelectedTreatment(mutatedSelectedTreatments);
  };

  const handleRemoveItemfromFRuleOutsTable = (item) => {
    const mutatedRuleOuts = ruleOutsData?.filter(
      (ruleOut) => item?.name !== ruleOut?.name,
    );
    const mutatedRecommededRuleOuts = ruleOutsRecommededData?.filter(
      (ruleOut) => item?.name !== ruleOut?.name,
    );
    const mutatedSelectedRuleOuts = selectedRuleOuts?.filter(
      (ruleOut) => item?.name !== ruleOut,
    );

    setRuleOutsData(mutatedRuleOuts);
    setRuleOutsRecommendedData(mutatedRecommededRuleOuts);
    setSelectedRuleOuts(mutatedSelectedRuleOuts);
  };

  const toggleApprovalPage = () => {
    setApprovalPage(!approvalPage);
  };

  /*const handleClearSignature = () => {
    signatureRef?.current?.clear();
  };*/

  const toggleEditTreatmentModal = (modalVisibilityState, medicationData) => {
    setShowEditDiagnosticsModal({
      visible: modalVisibilityState,
      editData: medicationData || null,
    });
  };

  const toggleEditDiagnosisModal = (modalVisibilityState, diagnosisData) => {
    setShowEditDiagnosisModal({
      visible: modalVisibilityState,
      editData: diagnosisData || null,
    });
  };

  const handleChangeResult = (value, record) => {
    const payload = treatmentPlanData?.treatmentRecommendations?.treatments.map(
      (treatment) => ({
        diagnosis_id: treatment?.diagnosis_id,
        result:
          record?.diagnosis_id === treatment?.diagnosis_id &&
          record?.id === treatment?.id
            ? value?.toLowerCase().trim()
            : treatment?.result[0]?.toLowerCase().trim(),
      }),
    );

    getAIMedicationRecommendation({
      pet_id: Number(petId),
      diagnosis: payload,
    });
  };
  handleChangeResult;

  const handleMedicationQuantityChange = (value, record) => {
    const mutatedMedications = medicationTableData?.map((med) =>
      med?.id == record?.id
        ? {
            ...med,
            current_price_details: {
              ...med?.current_price_details,
              quantity: value,
            },
          }
        : med,
    );

    const mutatedMedicationRecommendedData = medicationRecommendedData?.map(
      (med) =>
        med?.id == record?.id
          ? {
              ...med,
              current_price_details: {
                ...med?.current_price_details,
                quantity: value,
              },
            }
          : med,
    );

    setMedicationRecommededData(() => mutatedMedicationRecommendedData);
    setMedicationTableData(() => mutatedMedications);
  };

  const handleMedicationVolumeChange = (value, record) => {
    const mutatedMedications = medicationTableData?.map((med) =>
      med?.id == record?.id
        ? {
            ...med,
            current_price_details: med?.price_details?.filter(
              (price) => price?.volume == value,
            )[0],
          }
        : med,
    );

    setMedicationTableData(() => mutatedMedications);
  };

  const handleEditMedicationSubmit = (payload) => {
    const mutatedMedications = medicationTableData?.map((med) =>
      med?.id == payload?.id ? { ...med, ...payload } : med,
    );

    setMedicationTableData(() => mutatedMedications);
    toggleEditMedicationModal(false);
  };

  const handleEditDiagnosisSubmit = (payload) => {
    const mutatedRuleOuts = ruleOutsData?.map((ruleOut) =>
      ruleOut?.name == payload?.name ? { ...ruleOut, ...payload } : ruleOut,
    );

    setRuleOutsData(mutatedRuleOuts);
    toggleEditDiagnosisModal(false);
  };

  const handleEditDiagnosticsSubmit = (payload) => {
    const mutatedTreatments = treatmentTableData?.map((trt) =>
      trt?.id == payload?.id ? { ...trt, ...payload } : trt,
    );

    setTreatmentTableData(mutatedTreatments);
    toggleEditTreatmentModal(false);
  };

  const navigateBack = () => {
    history.push({
      search: `?soap=objective&&objectiveId=${
        objectiveData?.id || ''
      }&visitId=${subjectiveData?.subjective_note?.visitation_id}`,
    });
  };

  return (
    <div id="treatment-plan-form-wrapper">
      {isFetchingAITreatmentRecommendation ||
      getTreatmentPlanData?.isLoading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin tip="Chill a bit, we are getting you some AI Recommendations" />
        </div>
      ) : (
        <>
          <div className="custom-form-item-wrapper">
            <RuleOutsTable
              dropdownData={diagnosisDropDownData}
              isLoadingDropdownData={isFetchingDiagnosisData}
              onChangeDropdown={setSelectedRuleOuts}
              dropdownValue={selectedRuleOuts}
              tableData={ruleOutsData}
              isLoadingTableData={
                isFetchingDiagnosisData || getAIRuleOutsRecommendation.isLoading
              }
              handleRemoveItemfromFRuleOutsTable={
                handleRemoveItemfromFRuleOutsTable
              }
              toggleEditDiagnosisModal={toggleEditDiagnosisModal}
            />
          </div>
          <div className="custom-form-item-wrapper">
            <TreatmentsTable
              dropdownData={treatmentDropDownData}
              isLoadingDropdownData={isFetchingTreatmentData}
              onChangeDropdown={setSelectedTreatment}
              dropdownValue={selectedTreatment}
              tableData={treatmentTableData}
              isLoadingTableData={
                isFetchingTreatmentData || isFetchingAITreatmentRecommendation
              }
              handleRemoveItemfromTreatmentsTable={
                handleRemoveItemfromTreatmentsTable
              }
              toggleEditTreatmentModal={toggleEditTreatmentModal}
            />
          </div>

          <div className="custom-form-item-wrapper">
            <MedicationsTable
              dropdownData={medicationsDropDownData}
              isLoadingDropdownData={isFetchingMedicationData}
              onChangeDropdown={setSelectedMedication}
              dropdownValue={selectedMedication}
              tableData={medicationTableData}
              isLoadingTableData={
                isFetchingMedicationData || isFetchingAIMedicationRecommendation
              }
              handleMedicationQuantityChange={handleMedicationQuantityChange}
              handleMedicationVolumeChange={handleMedicationVolumeChange}
              handleRemoveItemfromMedicationsTable={
                handleRemoveItemfromMedicationsTable
              }
              toggleEditMedicationModal={toggleEditMedicationModal}
            />
          </div>
          <div className="title-wrapper">
            <Row>
              <Col span={4}>
                <Switch
                  unCheckedChildren="Client Not Phyiscally At Clinic"
                  checkedChildren="Client Phyiscally At Clinic"
                  onChange={() => setIsClientAtClinic((prvState) => !prvState)}
                  style={{ marginBottom: 30 }}
                />
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  size="small"
                  shape="round"
                  onClick={() => toggleApprovalPage()}
                >
                  View Treatment Plan
                </Button>
              </Col>
            </Row>
          </div>
          {/*{isClientAtClinic && (
            <div className="custom-form-item-wrapper">
              <Row>
                <Col span={24}>
                  <>
                    <div className="title-wrapper">
                      <h4>Signature</h4>
                    </div>
                    <div className="list-container">
                      <SignatureCanvas
                        penColor="black"
                        canvasProps={{
                          width: '600',
                          height: 200,
                          className: 'sigCanvas',
                        }}
                        ref={signatureRef}
                      />
                    </div>
                  </>
                  <Row justify="center" style={{ marginTop: 20 }}>
                    <Col span={4}>
                      <Button
                        type="dashed"
                        size="small"
                        shape="round"
                        onClick={handleClearSignature}
                      >
                        re-sign
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          )}*/}
          <div className="custom-form-item-wrapper">
            <Row>
              <Col span={24}>
                <div className="title-wrapper">
                  <h4>Please enter your Veterinary PIN</h4>
                  <p>This would help your lock this treatment plan</p>
                </div>
              </Col>
            </Row>

            <div>
              <CustomInputPassword
                size="large"
                style={{ width: 200, marginTop: 10 }}
              />
            </div>
          </div>

          <Row justify="center" style={{ marginTop: 30 }}>
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
                onClick={handleSaveTreatmentPlanData}
                loading={
                  saveTreatmentPlanData?.isLoading &&
                  !saveTreatmentPlanData?.isError
                }
              >
                Continue
              </Button>
            </Col>
          </Row>
        </>
      )}

      <Drawer
        title={`Edit ${showEditMedicatonModal.editData?.product_name}`}
        placement="right"
        onClose={() => toggleEditMedicationModal(false)}
        visible={showEditMedicatonModal.visible}
        style={{ position: 'absolute' }}
        width={1000}
      >
        <EditMedicationsForm
          editData={showEditMedicatonModal.editData}
          handleEditMedicationSubmit={handleEditMedicationSubmit}
        />
      </Drawer>

      {showEditDiagnosticsModal.visible && (
        <Drawer
          title="Edit Diagnostics"
          onClose={() => toggleEditTreatmentModal(false)}
          visible={showEditDiagnosticsModal.visible}
          width={1000}
          style={{ position: 'absolute' }}
        >
          <EditDiagnosticsForm
            handleSubmitData={handleEditDiagnosticsSubmit}
            editData={showEditDiagnosticsModal.editData}
            isEditing={editDiagnosticsMutation.isLoading}
          />
        </Drawer>
      )}

      {approvalPage && (
        <ApprovalPage
          approvalPage={approvalPage}
          toggleApprovalPage={toggleApprovalPage}
          treatmentTableData={treatmentTableData}
          isClientAtClinic={isClientAtClinic}
          medicationTableData={medicationTableData}
        />
      )}

      {showEditDiagnosisModal.visible && (
        <Drawer
          title="Edit Diagnosis"
          onClose={() => toggleEditDiagnosisModal(false)}
          visible={showEditDiagnosisModal.visible}
          width={1000}
          style={{ position: 'absolute' }}
        >
          <EditDiagnosisForm
            editData={showEditDiagnosisModal.editData}
            handleEditDiagonisSubmit={handleEditDiagnosisSubmit}
          />
        </Drawer>
      )}
    </div>
  );
};

export default TreatmentPlan;
