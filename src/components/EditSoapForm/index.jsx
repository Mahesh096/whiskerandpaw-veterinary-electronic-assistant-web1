// react libraries
import React, { useState } from 'react';

// third-party libraries
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  notification,
  Divider,
  Table,
  Drawer,
  Skeleton,
  Empty,
  ConfigProvider,
} from 'antd';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-query';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

// components
import AddTestForm from 'components/AddTestForm';
import EditTestForm from 'components/EditTestForm';

// API Client
import api from 'api';

// utils
import {
  convertToDiagnosisNames,
  convertToMedicationNames,
  convertToTreatmentNames,
} from 'components/KnowledgeBaseSOAP/utils';

const { Option } = Select;

const EditSoapFrom = ({ onEditDone, editData }) => {
  const [editSoapForm] = Form.useForm();
  const [addTestForm] = Form.useForm();
  const [editTestForm] = Form.useForm();
  const [tests, setTests] = useState([]);
  const [openAddTestForm, setOpenAddTestForm] = useState(false);
  const [openEditTestForm, setOpenEditTestForm] = useState(false);
  const [currentEditTestData, setCurrentEditTestData] = useState(null);

  const { data: medicationsData, isLoading: isLoadingMedications } = useQuery(
    'medications',
    () => api.medications.getAllMedications(),
  );

  const { data: diagnosisData, isLoading: isLoadingDiagnosis } = useQuery(
    'diagnosis',
    () => api.diagnosis.getAllDiagnosisAdmin(),
  );

  const fullEditData = useQuery(
    ['soap', editData?.rule_code],
    () => api.soap.getAllSoapRuleData(editData?.rule_code),
    {
      onSuccess(data) {
        editSoapForm.setFieldsValue({
          main_case: data.data?.rules.main_case,
          rule_outs: data.data?.rules.rule_outs?.map((rule) => +rule),
          differentials: data.data?.rules.differentials?.map((dif) => dif?.id),
        });

        setTests(
          data.data?.rules?.treatments?.map((trt, index) => ({
            ...trt,
            id: ++index,
          })),
        );
      },
      enabled: editData?.rule_code ? true : false,
    },
  );

  const { data: differentialsData, isLoading: isLoadingDifferentials } =
    useQuery('differentials', () => api.differentials.getAllDifferentials());

  const { data: treatmentsData, isLoading: isLoadingTreatments } = useQuery(
    'treatments',
    () => api.treatment.getAllTreatments(),
  );

  const getTreatementResultTypes = useMutation((treatmentId) =>
    api.treatment.getTreatmentResultTypes(treatmentId),
  );

  const getResultReasons = useMutation((result_type_id) =>
    api.treatment.getResultReasons(result_type_id),
  );

  const { data: cases, isLoading: isLoadingDifferentialCategories } = useQuery(
    'cases',
    () => api.differentials.getSOAPCases(),
  );

  const handleAddSOAPConnection = (formValues) => {
    editSoapConnectionMutation.mutate({
      ...formValues,
      treatments: tests.map((test) => ({
        ...test,
        id: undefined,
        result_name: undefined,
      })),
      rule_code: editData?.rule_code,
    });
  };

  const onClose = () => {
    setOpenAddTestForm((prvState) => !prvState);
  };

  const editSoapConnectionMutation = useMutation(
    (addMedicationData) => api.soap.editAdminSoapConnection(addMedicationData),
    {
      onSuccess: () => {
        notification.success({
          message: 'SOAP Connection has been successfully added',
          description: `You just added a new SOAP connection!`,
        });
        onEditDone();
        editSoapForm.resetFields();
      },
      onError: (error) => {
        notification.error({
          message: 'Add SOAP Connection Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleAddTest = (values) => {
    setTests((prvState) => [
      ...prvState,
      {
        id: ++tests.length,
        ...values,
        result_name: handleGetResultObject(values?.result_id)?.result_type,
        result_type_id: handleGetResultObject(values?.result_id)
          ?.result_type_id,
      },
    ]);

    addTestForm.resetFields();
  };

  const handleRemoveTest = (testObj) => {
    const mutatedTests = tests?.filter((tst) => tst.id !== testObj?.id);
    setTests(mutatedTests);
  };

  const handleEditTest = (testObj) => {
    setCurrentEditTestData(testObj);

    editTestForm.setFieldsValue({
      ...testObj,
      diagnosis: testObj?.diagnosis?.map((dia) => Number(dia)),
      rule_outs: testObj?.rule_outs?.map((rule) => Number(rule)),
      medications: testObj?.medications?.map((med) => Number(med)),
      result_id: testObj?.result_id,
    });
    getTreatementResultTypes.mutate(testObj?.treatment_id);
    setOpenEditTestForm(true);
  };

  const handleCloseEditTestForm = () => {
    setOpenEditTestForm(false);
  };

  const handleSetReasonInput = (value) => {
    const reasonObj = handleGetResultObject(value);

    if (reasonObj) {
      addTestForm.setFieldsValue({ reason: reasonObj.reason });
      editTestForm.setFieldsValue({ reason: reasonObj.reason });
    }
  };

  const handleGetResultObject = (result_id) => {
    return getTreatementResultTypes.data?.data?.results.filter(
      (rxt) => rxt?.id === result_id,
    )[0];
  };

  const handleSaveEditTest = (values) => {
    const mutatedTestArray = tests?.map((test) => {
      if (test?.id == currentEditTestData?.id) {
        return {
          ...values,
          result_name: handleGetResultObject(values?.result_id)?.result_type,
          result_type_id: handleGetResultObject(values?.result_id)
            ?.result_type_id,
        };
      }
      return test;
    });

    setTests(() => mutatedTestArray);
    handleCloseEditTestForm();
  };

  const columns = [
    {
      title: 'Diagnostics',
      dataIndex: '',
      ellipsis: true,
      render: function Actions(text, record) {
        return (
          <span>
            {convertToTreatmentNames(
              record?.treatment_id,
              treatmentsData?.data?.treatments,
            )}
          </span>
        );
      },
    },
    {
      title: 'Result',
      dataIndex: 'result_name',
      ellipsis: true,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      ellipsis: true,
      render: function Actions(text, record) {
        return <span>{record?.reason || 'N/A'}</span>;
      },
    },
    {
      title: 'Diagnosis',
      dataIndex: '',
      ellipsis: true,
      render: function Actions(text, record) {
        return (
          <span>
            {convertToDiagnosisNames(
              record?.diagnosis,
              diagnosisData?.data?.diagnosis,
            )}
          </span>
        );
      },
    },
    {
      title: 'Medications',
      dataIndex: '',
      ellipsis: true,
      render: function Actions(text, record) {
        return (
          <span>
            {convertToMedicationNames(
              record?.medications,
              medicationsData?.data?.medications,
            )}
          </span>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      render: function Actions(text, record) {
        return (
          <>
            <Button
              type="dashed"
              key={text}
              icon={<EditOutlined />}
              onClick={() => handleEditTest(record)}
              style={{ marginRight: 10 }}
            ></Button>
            <Button
              type="dashed"
              key={text}
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveTest(record)}
            ></Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      {fullEditData.isLoading ? (
        <Skeleton active />
      ) : (
        <Form
          layout="vertical"
          form={editSoapForm}
          onFinish={handleAddSOAPConnection}
        >
          <Row gutter={[30, 10]}>
            <Col span={10}>
              <Form.Item
                label="What type of case is this? "
                name="main_case"
                required={false}
              >
                <Select
                  className="custom-select"
                  size="large"
                  placeholder="Select case"
                  loading={isLoadingDifferentialCategories}
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
          <Row gutter={[30, 10]}>
            <Col span={8}>
              <Form.Item
                label="What Differentials would you have?"
                name="differentials"
                required={false}
              >
                <Select
                  size="large"
                  placeholder="Select differentials"
                  loading={isLoadingDifferentials}
                  mode="multiple"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      ?.includes(input?.toLowerCase())
                  }
                  optionFilterProp="children"
                  showSearch
                >
                  {differentialsData?.data?.differential?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Add Rule Outs"
                name="rule_outs"
                required={false}
              >
                <Select
                  size="large"
                  placeholder="Select rule outs"
                  loading={isLoadingDiagnosis}
                  mode="multiple"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      ?.includes(input?.toLowerCase())
                  }
                  optionFilterProp="children"
                  showSearch
                >
                  {diagnosisData &&
                    diagnosisData?.data?.diagnosis?.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>
            <Button icon={<PlusOutlined />} onClick={onClose}>
              Add your test
            </Button>
          </Divider>

          <Row gutter={[30, 10]}>
            <Col span={24}>
              <ConfigProvider
                renderEmpty={() => (
                  <Empty
                    description={
                      "It looks like there isn't any data in our database for this yet. Get started by clicking: Add your test."
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              >
                <Table
                  columns={columns}
                  dataSource={tests.reverse()}
                  bordered={false}
                />
              </ConfigProvider>
            </Col>
          </Row>

          <Row justify="end">
            <Button
              size="large"
              type="primary"
              className="custom-button"
              style={{ marginTop: 40 }}
              htmlType="submit"
              loading={
                editSoapConnectionMutation.isLoading &&
                !editSoapConnectionMutation.isError
              }
            >
              Save Changes
            </Button>
          </Row>
        </Form>
      )}

      {openAddTestForm && (
        <Drawer
          title="Add Test"
          placement={'right'}
          closable={true}
          onClose={onClose}
          visible={openAddTestForm}
          width={700}
          destroyOnClose
        >
          <AddTestForm
            diagnosis={diagnosisData?.data?.diagnosis}
            treatments={treatmentsData && treatmentsData?.data?.treatments}
            isFetchingResult={getTreatementResultTypes.isLoading}
            isLoadingDiagnosis={isLoadingDiagnosis}
            treatmentResults={getTreatementResultTypes?.data?.data?.results}
            isLoadingResultReasons={getResultReasons.isLoading}
            resultReasons={getResultReasons.data?.data?.results}
            handleAddTest={handleAddTest}
            medications={medicationsData && medicationsData?.data?.medications}
            isLoadingMedications={isLoadingMedications}
            isLoadingTreatments={isLoadingTreatments}
            onResultChange={handleSetReasonInput}
            onTreatmentChange={(value) =>
              getTreatementResultTypes.mutate(value)
            }
            form={addTestForm}
            differentials={differentialsData?.data?.differential}
            selectedDifferentials={editSoapForm.getFieldValue('differentials')}
          />
        </Drawer>
      )}
      {openEditTestForm && (
        <Drawer
          title="Edit Test"
          placement={'right'}
          closable={true}
          onClose={handleCloseEditTestForm}
          visible={openEditTestForm}
          width={700}
          destroyOnClose
        >
          <EditTestForm
            diagnosis={diagnosisData?.data?.diagnosis}
            treatments={treatmentsData && treatmentsData?.data?.treatments}
            isFetchingResult={getTreatementResultTypes.isLoading}
            isLoadingDiagnosis={isLoadingDiagnosis}
            treatmentResults={getTreatementResultTypes?.data?.data?.results}
            isLoadingResultReasons={getTreatementResultTypes.isLoading}
            resultReasons={getTreatementResultTypes?.data?.data?.results}
            handleAddTest={handleSaveEditTest}
            medications={medicationsData && medicationsData?.data?.medications}
            isLoadingMedications={isLoadingMedications}
            isLoadingTreatments={isLoadingTreatments}
            onResultChange={handleSetReasonInput}
            onTreatmentChange={(value) =>
              getTreatementResultTypes.mutate(value)
            }
            form={editTestForm}
            differentials={differentialsData?.data?.differential}
            selectedDifferentials={editSoapForm.getFieldValue('differentials')}
          />
        </Drawer>
      )}
    </>
  );
};

EditSoapFrom.propTypes = {
  onEditDone: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
};

export default EditSoapFrom;
