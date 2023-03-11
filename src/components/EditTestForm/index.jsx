import React, { useEffect } from 'react';

// third-party libraries
import PropTypes from 'prop-types';
import { Form, Row, Col, Select, Button, Input } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const EditTestForm = ({
  form,
  diagnosis,
  treatments,
  treatmentResults,
  isFetchingResult,
  isLoadingDiagnosis,
  handleAddTest,
  medications,
  isLoadingMedications,
  isLoadingTreatments,
  onResultChange,
  differentials,
  selectedDifferentials,
  onTreatmentChange,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      differential_ids: selectedDifferentials,
    });
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleAddTest}
      id="add-test-form"
    >
      <Row gutter={[30, 10]} align="middle">
        <Col span={12}>
          <Form.Item
            label="Select Diagnostic"
            name="treatment_id"
            required={false}
            rules={[{ required: true, message: 'Select Diagnostic' }]}
          >
            <Select
              size="large"
              placeholder="Select treatment"
              loading={isLoadingTreatments}
              optionFilterProp="children"
              showSearch
              maxTagCount={'responsive'}
              onChange={onTreatmentChange}
            >
              {treatments?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Result"
            name="result_id"
            required={false}
            rules={[{ required: true, message: 'Select Result' }]}
          >
            <Select
              size="large"
              placeholder="Select result"
              loading={isFetchingResult}
              optionFilterProp="children"
              showSearch
              onChange={onResultChange}
            >
              {treatmentResults?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.result_type};{item?.reason}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Reason" name="reason" required={false}>
            <Input type="text" size="large" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Finalize Diagnosis"
            name="diagnosis"
            required={false}
          >
            <Select
              size="large"
              placeholder="Select diagnosis"
              loading={isLoadingDiagnosis}
              mode="multiple"
              optionFilterProp="children"
              showSearch
            >
              {diagnosis?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Finalize Medications"
            name="medications"
            required={false}
          >
            <Select
              size="large"
              placeholder="Select medications"
              loading={isLoadingMedications}
              optionFilterProp="children"
              showSearch
              mode="multiple"
              maxTagCount={'responsive'}
            >
              {medications?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.product_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Differentials"
            name="differential_ids"
            required={false}
            initialValue={selectedDifferentials}
          >
            <Select
              size="large"
              placeholder="Select differentials"
              mode="multiple"
              optionFilterProp="children"
              showSearch
              defaultValue={selectedDifferentials}
            >
              {differentials?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Plan Description"
            name="plan_description"
            required={false}
            rules={[{ required: true, message: 'Enter plan description' }]}
          >
            <TextArea
              className="custom-textarea"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={2}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            form="add-test-form"
          >
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

EditTestForm.propTypes = {
  treatments: PropTypes.array.isRequired,
  treatmentResults: PropTypes.array.isRequired,
  isFetchingResult: PropTypes.bool.isRequired,
  differentials: PropTypes.array.isRequired,
  diagnosis: PropTypes.array.isRequired,
  isLoadingDiagnosis: PropTypes.bool.isRequired,
  handleAddTest: PropTypes?.func?.isRequired,
  medications: PropTypes?.array?.isRequired,
  selectedDifferentials: PropTypes?.array?.isRequired,
  isLoadingMedications: PropTypes?.func?.isRequired,
  isLoadingTreatments: PropTypes?.func?.isRequired,
  onResultChange: PropTypes?.func?.isRequired,
  onTreatmentChange: PropTypes?.func?.isRequired,
  form: PropTypes?.any.isRequired,
};

export default EditTestForm;
