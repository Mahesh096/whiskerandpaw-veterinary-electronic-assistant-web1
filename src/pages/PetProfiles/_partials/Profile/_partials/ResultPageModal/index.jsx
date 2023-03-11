// react libraries
import React, { useEffect, useState, useContext } from 'react';

// third-party libraries
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Drawer,
  Tooltip,
  DatePicker,
  notification,
} from 'antd';
import moment from 'moment/moment';
import { useQuery, useMutation } from 'react-query';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useHistory, useParams } from 'react-router-dom';

// components
import FinalSummaryPDF from 'pdf/FinalSummaryPDF/index';
import TreatmentsTable from 'pages/PetProfiles/_partials/Profile/_partials/components/TreatmentsTable';
import RuleOutsTable from 'pages/PetProfiles/_partials/Profile/_partials/components/RuleOutsTable';
import MedicationsTable from 'pages/PetProfiles/_partials/Profile/_partials/components/MedicationsTable';
import EditMedicationsForm from 'components/EditMedicationForm';
import EditDiagnosticsForm from 'components/EditDiagnosticsForm';
import EditDiagnosisForm from 'components/EditDiagnosisForm';
import { PetProfileContext } from 'pages/PetProfiles/_partials/Profile/context';

// utils
import useSearchQuery from 'utils/useSearchQuery';

// API Client
import api from 'api';
import uniqByProp from 'utils/uniArrayValues';
import isEmpty from 'utils/isEmpty';

const TextArea = Input.TextArea;

const ResultPageModal = () => {
  const { petParent, petDetails, clinicData, visitData } =
    useContext(PetProfileContext);

  let history = useHistory();
  const query = useSearchQuery();
  const { petId } = useParams();

  const subjectiveId = query.get('subjectiveId');
  const visitId = Number(query.get('visitId'));

  const [selectedTreatment, setSelectedTreatment] = useState([]);
  const [treatmentDropDownData, setTreatmentDropDown] = useState([]);
  const [treatmentTableData, setTreatmentTableData] = useState([]);
  const [treatmentRecommededData, setTreatmentRecommendedData] = useState([]);
  const [ruleOutsRecommededData, setRuleOutsRecommendedData] = useState([]);
  const [diagnosisDropDownData, setDiagnosisDropDown] = useState([]);
  const [selectedRuleOuts, setSelectedRuleOuts] = useState([]);
  const [selectedDiagnosos, setSelectedDiagnosos] = useState([]);
  const [ruleOutsData, setRuleOutsData] = useState([]);
  const [diagnosisTableData, setDiagnosisTableData] = useState([]);

  const [selectedMedication, setSelectedMedication] = useState([]);
  const [medicationsDropDownData, setMedicationDropDown] = useState([]);
  const [medicationTableData, setMedicationTableData] = useState([]);
  const [medicationRecommendedData, setMedicationRecommededData] = useState([]);
  const [selectedTreatmentResults, setSelectedTreatmentResults] = useState([]);
  const [additionalCareText, setAdditionalCareText] = useState('');

  const [showEditDiagnosticsModal, setShowEditDiagnosticsModal] = useState({
    visible: false,
    editData: null,
  });

  const [showEditMedicatonModal, setShowMedicationEditModal] = useState({
    visible: false,
    editData: null,
  });

  const [showEditDiagnosisModal, setShowEditDiagnosisModal] = useState({
    visible: false,
    editData: null,
  });

  useEffect(() => {
    setTreatmentTableData(() => [
      ...treatmentRecommededData,
      ...treatmentDropDownData?.filter((item) =>
        selectedTreatment.includes(item.name),
      ),
    ]);
  }, [selectedTreatment, treatmentDropDownData, treatmentRecommededData]);

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
    const ruleOutsLocalData = [
      ...ruleOutsRecommededData,
      ...diagnosisDropDownData?.filter((item) =>
        selectedRuleOuts.includes(item.id),
      ),
    ];

    setRuleOutsData(() => ruleOutsLocalData);
  }, [selectedRuleOuts, diagnosisDropDownData, ruleOutsRecommededData]);

  const handleReasonConsultation = (data) => {
    const reason = casesData?.data.main_categories?.filter(
      (category) => category?.id == data?.main_case,
    );

    return reason ? reason[0]?.name : '';
  };

  const { data: clinicExamsData } = useQuery(
    'clinic-exams',
    () => api.clinic.getClinicExaminationV2(),
    {
      onSuccess() {},
    },
  );

  const { data: casesData } = useQuery('cases', () =>
    api.differentials.getSOAPCases(),
  );

  const { isLoading: isFetchingTreatmentData } = useQuery(
    'treatment',
    () => api.treatment.getAllTreatments(),
    {
      onSuccess(data) {
        if (data) setTreatmentDropDown(data?.data?.treatments);
      },
    },
  );

  const editTreatmentResultData = useMutation(
    (treatmentPlanDataPayload) =>
      api.visitation.updateTreatmentResultData(treatmentPlanDataPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Update Treatment Result',
          description: `Changes has saved successfully!`,
          key: 'treatmentResult',
        });
      },
      onError: (error) => {
        notification.error({
          message: 'Update Treatment Result Error',
          description: `${error.response.data.message}`,
          key: 'treatmentResultError',
        });
      },
    },
  );

  const saveTreatmentResultData = useMutation(
    (treatmentPlanDataPayload) =>
      api.visitation.saveTreatmentResultData(treatmentPlanDataPayload),
    {
      onSuccess: () => {
        notification.success({
          message: 'Save Treatment Result',
          description: `Treatment result has been saved`,
          key: 'treatmentSave',
        });
      },
      onError: (error) => {
        notification.error({
          message: 'Save Treatment Result Error',
          description: `${error.response.data.message}`,
          key: 'treatmentSaveError',
        });
      },
    },
  );

  const { data: getSubjectiveData } = useQuery(
    ['subjective_data', subjectiveId],
    () => api.visitation.getSubjectiveData(subjectiveId),
    {},
  );

  const {
    mutate: getAIDiagnosisRecommendation,
    isLoading: isFetchingAIRecommendation,
    data: diagnosisData,
  } = useMutation(
    (payload) => api.visitation.getAIDiagnosisRecommendation(payload),
    {
      onSuccess(data) {
        setDiagnosisTableData(data?.data?.diagnosis);
      },
    },
  );

  const {
    mutate: getAIMedicationsRecommendation,
    isLoading: isFetchingAIMedicationsRecommendation,
  } = useMutation(
    (payload) => api.visitation.getAITreatmentMedicationRecommendation(payload),
    {
      onSuccess: (data) => {
        setMedicationTableData(data?.data?.medications);
      },
    },
  );

  const { isLoading: isFetchingDiagnosisData } = useQuery(
    'diagnosis',
    () => api.diagnosis.getAllDiagnosis(),
    {
      onSuccess(data) {
        if (data) setDiagnosisDropDown(data?.data?.diagnosis);
      },
    },
  );

  const { isLoading: isFetchingMedicationData } = useQuery(
    'medications',
    () => api.medications.getAllMedications(),
    {
      onSuccess(data) {
        if (data) setMedicationDropDown(data?.data?.medications);
      },
    },
  );

  const getTreatmentPlanData = useMutation(
    'treatmentPlanData',
    (visitation_id) => api.visitation.getTreatmentPlanData(visitation_id),
    {
      onSuccess(data) {
        if (data?.data?.pet_process?.process_data) {
          if (data?.data?.pet_process?.process_data?.treatments?.length) {
            setTreatmentRecommendedData(
              data?.data?.pet_process?.process_data?.treatments.map(
                (treatment) => ({ ...treatment, ai: false }),
              ),
            );

            setTreatmentTableData(() =>
              data?.data?.pet_process?.process_data?.treatments.map(
                (treatment) => ({ ...treatment, ai: false }),
              ),
            );
          }
          if (data?.data?.pet_process?.process_data?.ruleOuts?.length) {
            setRuleOutsRecommendedData(
              data?.data?.pet_process?.process_data?.ruleOuts.map(
                (ruleOut) => ({ ...ruleOut, ai: false }),
              ),
            );
            setRuleOutsData(() =>
              data?.data?.pet_process?.process_data?.ruleOuts.map(
                (ruleOut) => ({ ...ruleOut, ai: false }),
              ),
            );
          }
          if (data?.data?.pet_process?.process_data?.diagnosis?.length) {
            setDiagnosisTableData(() =>
              data?.data?.pet_process?.process_data?.diagnosis.map((diag) => ({
                ...diag,
                ai: false,
              })),
            );
          }
          if (data?.data?.pet_process?.process_data?.medications?.length) {
            setMedicationRecommededData(
              data?.data?.pet_process?.process_data?.medications.map(
                (ruleOut) => ({ ...ruleOut, ai: false }),
              ),
            );
            setMedicationTableData(() =>
              data?.data?.pet_process?.process_data?.medications.map(
                (ruleOut) => ({ ...ruleOut, ai: false }),
              ),
            );
          }
          return;
        }
      },
    },
  );

  const getTreatmentResultData = useQuery(
    'treatmentResultData',
    () =>
      api.visitation.getTreatementResultData({
        visitation_id: visitId,
        pet_id: petId,
      }),
    {
      onSuccess(data) {
        if (isEmpty(data?.data)) {
          getTreatmentPlanData.mutate(visitId);
          return;
        }

        if (data?.data?.results) {
          if (data?.data?.results?.result?.treatments?.length) {
            setTreatmentRecommendedData(
              data?.data?.results?.result?.treatments.map((treatment) => ({
                ...treatment,
                ai: false,
              })),
            );

            setTreatmentTableData(() =>
              data?.data?.results?.result?.treatments.map((treatment) => ({
                ...treatment,
                ai: false,
              })),
            );
          }
          if (data?.data?.results?.result?.ruleOuts?.length) {
            setRuleOutsRecommendedData(
              data?.data?.results?.result?.ruleOuts.map((ruleOut) => ({
                ...ruleOut,
                ai: false,
              })),
            );
            setRuleOutsData(() =>
              data?.data?.results?.result?.ruleOuts.map((ruleOut) => ({
                ...ruleOut,
                ai: false,
              })),
            );
          }
          if (data?.data?.results?.result?.diagnosis?.length) {
            console.log(data?.data?.results?.result?.diagnosis);
            setDiagnosisTableData(() => data?.data?.results?.result?.diagnosis);
          }
          if (data?.data?.results?.result?.medications?.length) {
            setMedicationRecommededData(
              data?.data?.results?.result?.medications.map((ruleOut) => ({
                ...ruleOut,
                ai: false,
              })),
            );
            setMedicationTableData(() =>
              data?.data?.results?.result?.medications.map((ruleOut) => ({
                ...ruleOut,
                ai: false,
              })),
            );
          }
        }
      },
    },
  );

  const handleClinicExamIssues = (differential) => {
    const differentialIssues =
      clinicExamsData?.data?.differential[differential];

    const issuesInfo = visitData?.objective_note?.clinic_examinations[
      differential
    ].issues?.map((issue) => {
      const data = differentialIssues?.filter((item) => item?.id == issue);
      return data ? data[0]?.name : '';
    });

    return issuesInfo;
  };

  const subjectiveData = {
    additionalNotes: getSubjectiveData?.data?.subjective_note?.additional_notes,
    cheifComplaint: getSubjectiveData?.data?.subjective_note?.chief_complaint,
    reasonsForConsultation: handleReasonConsultation(
      getSubjectiveData?.data?.subjective_note?.reason_for_consultation,
    ),
    petVitalsData: {
      temperature:
        getSubjectiveData?.data?.subjective_note?.vitals?.temperature?.value ??
        0,
      heart_rate:
        getSubjectiveData?.data?.subjective_note?.vitals?.heart_rate?.value ??
        0,
      respiratory_rate:
        getSubjectiveData?.data?.subjective_note?.vitals?.respiratory_rate
          ?.value ?? 0,
      weight:
        getSubjectiveData?.data?.subjective_note?.vitals?.weight?.value ?? 0,
    },
    additionalCareText,
  };

  const clinicExamination = {
    examinations:
      visitData?.objective_note?.clinic_examinations &&
      Object.keys(visitData?.objective_note?.clinic_examinations)?.map(
        (res) => {
          return {
            name: res,
            issues: handleClinicExamIssues(res)?.join(),
            comment:
              visitData?.objective_note?.clinic_examinations[res].comment,
            status:
              visitData?.objective_note?.clinic_examinations[res].status ||
              'N/A',
          };
        },
      ),
    notes: visitData?.objective_note?.medical_history_notes,
    body_score: visitData?.objective_note?.body_score,
  };

  const handleSaveTreatmentPlanData = () => {
    const editPayload = {
      visitation_id: visitId,
      pet_id: petId,
      result: {
        ruleOuts: ruleOutsData,
        treatments: treatmentTableData,
        medications: medicationTableData,
        diagnosis: diagnosisData?.data?.diagnosis,
      },
    };

    if (getTreatmentResultData?.data?.data?.results?.id) {
      editTreatmentResultData.mutate({
        ...editPayload,
        id: getTreatmentResultData?.data?.data?.results?.id,
      });
      return;
    }

    saveTreatmentResultData.mutate(editPayload);
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

  const handleChangeTreatemntTestDate = (
    dateObj,
    trtmentData,
    testDateType,
  ) => {
    const mutatedTreatments = treatmentTableData?.map((trt) => {
      if (trt?.id == trtmentData?.id) {
        const newTrtData = {
          ...trt,
          testResult: {
            ...(trt?.testResult || {}),
          },
        };

        newTrtData.testResult[`${testDateType}`] = dateObj.format('YYYY-MM-DD');

        return newTrtData;
      }
      return trt;
    });

    setTreatmentTableData(mutatedTreatments);
  };

  const handleAdditionalTextChange = (text, trtmentData) => {
    const mutatedTreatments = treatmentTableData?.map((trt) => {
      if (trt?.id == trtmentData?.id) {
        const newTrtData = {
          ...trt,
          testResult: {
            ...(trt?.testResult || {}),
            additionalNotes: text,
          },
        };
        return newTrtData;
      }
      return trt;
    });
    setTreatmentTableData(mutatedTreatments);
  };

  const handleChangeResultValue = (resultValue, record) => {
    const result = record?.results.filter(
      (result) => result?.id === resultValue,
    )[0];

    const mutatedTreatments = treatmentTableData?.map((trt) => {
      if (trt?.id == record?.id) {
        const newTrtData = {
          ...trt,
          testResult: {
            ...(trt?.testResult || {}),
            current_result: result,
          },
        };
        return newTrtData;
      }
      return trt;
    });

    setTreatmentTableData(mutatedTreatments);

    const selectedResultPayload = { ...result, treatment_id: record?.id };

    if (!selectedTreatmentResults?.length) {
      getRecommendationForDiagnosisAndMedications([selectedResultPayload]);
      setSelectedTreatmentResults([selectedResultPayload]);
      return;
    }

    if (selectedTreatmentResults?.length) {
      const mutatedResults = selectedTreatmentResults.filter(
        (result) => result?.treatment_id != record?.id,
      );

      setSelectedTreatmentResults(() => [
        ...mutatedResults,
        selectedResultPayload,
      ]);

      getRecommendationForDiagnosisAndMedications([
        ...mutatedResults,
        selectedResultPayload,
      ]);
    }
  };

  const handleClearResultValue = (value, record) => {
    const mutatedSelectedTreatmentResult = selectedTreatmentResults.filter(
      (trt) => trt?.id != value,
    );

    setSelectedTreatmentResults(mutatedSelectedTreatmentResult);
    getRecommendationForDiagnosisAndMedications(mutatedSelectedTreatmentResult);

    const mutatedTreatments = treatmentTableData?.map((trt) => {
      if (trt?.id == record?.id) {
        const newTrtData = {
          ...trt,
          testResult: {
            current_result: undefined,
          },
        };
        return newTrtData;
      }
      return trt;
    });
    setTreatmentTableData(mutatedTreatments);
  };

  const getRecommendationForDiagnosisAndMedications = (selectedTreatments) => {
    getAIDiagnosisRecommendation({
      main_case: 1,
      treatments: selectedTreatments?.map((result) => ({
        treatment_id: result?.treatment_id,
        result_type_id: result?.result_type_id,
        reason: result?.reason,
      })),
    });

    getAIMedicationsRecommendation({
      main_case: 1,
      treatments: selectedTreatments?.map((result) => ({
        treatment_id: result?.treatment_id,
        result_type_id: result?.result_type_id,
        reason: result?.reason,
      })),
    });
  };

  const txSugguestionColumn = [
    {
      title: 'Treatment Name',
      dataIndex: 'name',
      key: 2,
      width: 100,
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name || 'N/A'}
        </Tooltip>
      ),
    },
    {
      title: 'Test Date',
      dataIndex: '',
      key: 3,
      width: 200,
      render: function (name, record) {
        return (
          <DatePicker
            key={name}
            defaultValue={
              record?.testResult?.start &&
              moment(record?.testResult?.start, 'YYYY-MM-DD')
            }
            style={{ width: '100%' }}
            onChange={(e) => handleChangeTreatemntTestDate(e, record, 'start')}
          />
        );
      },
    },
    {
      title: 'Final Result Date',
      dataIndex: '',
      key: 4,
      width: 200,
      render: function (name, record) {
        return (
          <DatePicker
            key={name}
            style={{ width: '100%' }}
            defaultValue={
              record?.testResult?.end &&
              moment(record?.testResult?.end, 'YYYY-MM-DD')
            }
            onChange={(e) => handleChangeTreatemntTestDate(e, record, 'end')}
          />
        );
      },
    },
    {
      title: 'Result',
      width: 3,
      key: 5,
      render: function Actions(text, record) {
        return (
          <>
            <Select
              size="large"
              placeholder="Select result"
              optionFilterProp="children"
              showSearch
              style={{ width: '100%' }}
              defaultValue={record?.testResult?.current_result?.id}
              onSelect={(value) => handleChangeResultValue(value, record)}
              onDeselect={(value) => handleClearResultValue(value, record)}
              allowClear
            >
              {uniqByProp('result_id')(record.results)?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.result_name};{item?.reason}
                </Select.Option>
              ))}
            </Select>
          </>
        );
      },
    },
    {
      title: 'Additional Note',
      dataIndex: 'name',
      key: 6,
      width: 200,
      render: (name, record) => (
        <Input
          key={name}
          value={record?.testResult?.additionalNotes}
          onChange={(e) => handleAdditionalTextChange(e?.target?.value, record)}
        />
      ),
    },
  ];

  const toggleEditMedicationModal = (modalVisibilityState, medicationData) => {
    setShowMedicationEditModal({
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

  const toggleEditTreatmentModal = (modalVisibilityState, medicationData) => {
    setShowEditDiagnosticsModal({
      visible: modalVisibilityState,
      editData: medicationData || null,
    });
  };
  const handleEditMedicationSubmit = (payload) => {
    const mutatedMedications = medicationTableData?.map((med) =>
      med?.id == payload?.id ? { ...med, ...payload } : med,
    );

    setMedicationTableData(() => mutatedMedications);
    toggleEditMedicationModal(false);
  };

  const handleRemoveItemfromDiagnosisTable = (item) => {
    const mutatedDiagnosis = diagnosisTableData?.filter(
      (diag) => item?.name !== diag?.name,
    );
    const mutatedSelectedDiagnosis = selectedDiagnosos?.filter(
      (diag) => item?.name !== diag,
    );

    setDiagnosisTableData(mutatedDiagnosis);
    setSelectedDiagnosos(mutatedSelectedDiagnosis);
  };

  const handleEditDiagnosticsSubmit = (payload) => {
    const mutatedTreatments = treatmentTableData?.map((trt) =>
      trt?.id == payload?.id ? { ...trt, ...payload } : trt,
    );

    setTreatmentTableData(mutatedTreatments);
    toggleEditTreatmentModal(false);
  };

  const handleEditDiagnosisSubmit = (payload) => {
    const mutatedRuleOuts = diagnosisTableData?.map((ruleOut) =>
      ruleOut?.id == payload?.id ? { ...ruleOut, ...payload } : ruleOut,
    );

    setDiagnosisTableData(mutatedRuleOuts);
    toggleEditDiagnosisModal(false);
  };

  const navigateBack = () => {
    history.push({
      search: `?soap=assessment&visitId=${visitId}`,
    });
  };

  return (
    <>
      <div className="custom-form-item-wrapper">
        <TreatmentsTable
          dropdownData={treatmentDropDownData}
          isLoadingDropdownData={isFetchingTreatmentData}
          onChangeDropdown={setSelectedTreatment}
          dropdownValue={selectedTreatment}
          tableData={treatmentTableData}
          isLoadingTableData={
            isFetchingTreatmentData ||
            getTreatmentPlanData.isLoading ||
            getTreatmentPlanData.isFetching ||
            getTreatmentResultData.isFetching ||
            getTreatmentResultData.isLoading
          }
          handleRemoveItemfromTreatmentsTable={
            handleRemoveItemfromTreatmentsTable
          }
          customTableColumns={txSugguestionColumn}
          toggleEditTreatmentModal={toggleEditTreatmentModal}
        />
      </div>
      {!!ruleOutsData?.length && (
        <div className="custom-form-item-wrapper">
          <RuleOutsTable
            dropdownData={diagnosisDropDownData}
            isLoadingDropdownData={isFetchingDiagnosisData}
            onChangeDropdown={setSelectedRuleOuts}
            dropdownValue={selectedRuleOuts}
            tableData={ruleOutsData}
            isLoadingTableData={isFetchingDiagnosisData}
            isRuleOut
          />
        </div>
      )}
      <div className="custom-form-item-wrapper">
        <RuleOutsTable
          dropdownData={diagnosisDropDownData}
          isLoadingDropdownData={isFetchingDiagnosisData}
          onChangeDropdown={setSelectedDiagnosos}
          dropdownValue={selectedRuleOuts}
          tableData={diagnosisTableData}
          isLoadingTableData={isFetchingAIRecommendation}
          isRuleOut={false}
          handleRemoveItemfromFRuleOutsTable={
            handleRemoveItemfromDiagnosisTable
          }
          toggleEditDiagnosisModal={toggleEditDiagnosisModal}
        />
      </div>
      <div className="custom-form-item-wrapper">
        <MedicationsTable
          dropdownData={medicationsDropDownData}
          isLoadingDropdownData={isFetchingMedicationData}
          onChangeDropdown={setSelectedMedication}
          dropdownValue={selectedMedication}
          tableData={medicationTableData}
          isLoadingTableData={isFetchingAIMedicationsRecommendation}
          handleMedicationQuantityChange={handleMedicationQuantityChange}
          handleMedicationVolumeChange={handleMedicationVolumeChange}
          handleRemoveItemfromMedicationsTable={
            handleRemoveItemfromMedicationsTable
          }
          toggleEditMedicationModal={toggleEditMedicationModal}
        />
      </div>
      <Row>
        <Col span={24}>
          <h4>Additional Care Recommendations</h4>
        </Col>
        <Col span={24}>
          <TextArea
            rows={4}
            className="custom-textarea"
            onChange={(e) => setAdditionalCareText(e?.target?.value)}
          />
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: 30 }} gutter={20}>
        <Button size="large" shape="round" onClick={navigateBack}>
          Previous
        </Button>
        <Col>
          <PDFDownloadLink
            document={
              <FinalSummaryPDF
                petDetails={petDetails}
                petParentData={petParent}
                clinicExamination={clinicExamination}
                diagnosis={diagnosisTableData || []}
                treatments={treatmentTableData || []}
                medications={medicationTableData || []}
                subjectiveData={subjectiveData}
                handleClinicData={clinicData?.data?.clinic}
              />
            }
            fileName="final-summary.pdf"
          >
            {({ loading }) =>
              loading ? (
                <Button size="large" shape="round">
                  Download Summary
                </Button>
              ) : (
                <Button size="large" shape="round">
                  Download Summary
                </Button>
              )
            }
          </PDFDownloadLink>
        </Col>
        <Col>
          <Button
            loading={
              saveTreatmentResultData?.isLoading ||
              editTreatmentResultData.isLoading
            }
            type="primary"
            size="large"
            shape="round"
            onClick={handleSaveTreatmentPlanData}
          >
            Save Changes
          </Button>
        </Col>
      </Row>

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
          />
        </Drawer>
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
    </>
  );
};

export default ResultPageModal;
