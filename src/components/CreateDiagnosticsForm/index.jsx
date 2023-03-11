// react libraries
import React, { useState } from 'react';

// third-party libraries
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Input,
  Radio,
  InputNumber,
  Table,
  Divider,
} from 'antd';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { DeleteOutlined } from '@ant-design/icons';

// components
import { CustomInput } from 'components/CustomInput';

// utils
import currencyParser from 'utils/currencyParser';
import currencyFormatter from 'utils/currencyFormatter';

// API client
import api from 'api';

const { TextArea } = Input;
const { Option } = Select;

const CreateDiagnosticsForm = ({ handleSubmitData, isCreating }) => {
  const [subResultForm] = Form.useForm();
  const [addDiagnosticsForm] = Form.useForm();
  const [subResults, setSubResults] = useState([]);

  const { isLoading: isFetchingResult, data: treatmentResults } = useQuery(
    'treatmentResult',
    () => api.treatment.getAllResultTypes(),
  );

  const { data: treatmentCategoryData, isLoading: isLoadingTreatmentCategory } =
    useQuery('treatment_category', () => api.treatment.getTreatmentCategory());

  const handleCreateDiagnostics = (formValues) => {
    const payload = {
      category: treatmentCategoryData?.data?.treatment?.filter(
        (trt) => formValues?.category_id === trt?.id,
      )[0]?.category,
      category_id: formValues?.category_id,
      name: formValues?.name,
      description: formValues?.description,
      cost: formValues?.cost?.toFixed(2) || '0.00',
      tax: formValues?.tax,
      results: subResults?.map((rxt) => ({ ...rxt, f_id: undefined })),
    };

    handleSubmitData(payload);
  };

  const handleAddSubResult = () => {
    if (subResultForm.getFieldValue('result_type_id')) {
      setSubResults((prvState) => [
        ...prvState,
        {
          f_id: ++subResults.length,
          ...subResultForm.getFieldsValue(),
        },
      ]);

      subResultForm.resetFields();
    }
  };

  const handleRemoveResultSubType = (subTypeObj) => {
    const mutatedResultSubType = subResults?.filter(
      (rxt) => rxt.f_id !== subTypeObj?.f_id,
    );

    setSubResults(mutatedResultSubType);
  };

  const columns = [
    {
      title: 'Result',
      dataIndex: '',
      ellipsis: true,
      render: function Actions(text, record) {
        return (
          <span>
            {
              treatmentResults?.data?.results?.filter(
                (res) => res?.id === record?.result_type_id,
              )[0]?.name
            }
          </span>
        );
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      ellipsis: true,
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
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveResultSubType(record)}
            ></Button>
          </>
        );
      },
    },
  ];

  return (
    <Form
      layout="vertical"
      form={addDiagnosticsForm}
      onFinish={handleCreateDiagnostics}
    >
      <Row gutter={[30, 10]}>
        <Col span={12}>
          <Form.Item label="Category" name="category_id" required={false}>
            <Select
              className="custom-select"
              size="large"
              placeholder="Select a category"
              loading={isLoadingTreatmentCategory}
              filterOption={(input, option) =>
                option?.children?.toLowerCase()?.includes(input?.toLowerCase())
              }
              optionFilterProp="children"
              showSearch
            >
              {treatmentCategoryData?.data?.treatment?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.category}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Treatment Name" name="name" required={false}>
            <CustomInput size="large" type="text" placeholder="" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[30, 10]}>
        <Col span={24}>
          <Form.Item label="Description" name="description" required={false}>
            <TextArea
              className="custom-textarea"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[30, 10]}>
        <Col span={12}>
          <Form.Item label="Cost" name="cost" required={false}>
            <InputNumber
              formatter={currencyFormatter('USD')}
              parser={currencyParser}
              style={{ width: '100%' }}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Taxable?" name={'tax'} required={false}>
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left"> Add result </Divider>

      <>
        <Form form={subResultForm}>
          <Row gutter={[30, 10]} align="middle">
            <Col span={6}>
              <Form.Item label="Result" name="result_type_id" required={false}>
                <Select
                  size="large"
                  placeholder="Select result"
                  loading={isFetchingResult}
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      ?.includes(input?.toLowerCase())
                  }
                  optionFilterProp="children"
                  showSearch
                >
                  {treatmentResults &&
                    treatmentResults?.data?.results?.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Reason" name="reason" required={false}>
                <Input size="large" type="text" placeholder="" />
              </Form.Item>
            </Col>

            <Col span={1}>
              <Button size="large" onClick={handleAddSubResult}>
                Add Result
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={subResults}
              pagination={{ position: ['none', 'none'] }}
            />
          </Col>
        </Row>
      </>

      <Row justify="end">
        <Button
          size="large"
          type="primary"
          className="custom-button"
          style={{ marginTop: 40 }}
          htmlType="submit"
          loading={isCreating}
        >
          Add Diagnostics
        </Button>
      </Row>
    </Form>
  );
};

CreateDiagnosticsForm.propTypes = {
  handleSubmitData: PropTypes.func.isRequired,
  isCreating: PropTypes.bool,
};

export default CreateDiagnosticsForm;
