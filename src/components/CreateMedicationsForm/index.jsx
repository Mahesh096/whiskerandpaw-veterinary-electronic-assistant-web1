// react libraries
import React from 'react';

// third-party libraries
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Input,
  Divider,
  notification,
  Table,
  Empty,
  ConfigProvider,
} from 'antd';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-query';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// components
import { CustomInput } from 'components/CustomInput';
import { AppStateContext } from 'AppContext';
import PricingDetailsModal from 'components/PricingDetailsModal';

// API Client
import api from 'api';

const { TextArea } = Input;
const { Option } = Select;

const CreateMedicationsForm = ({ onCreateDone }) => {
  const [addMedicationForm] = Form.useForm();
  const { clinics } = React.useContext(AppStateContext);
  const [showPricingDetailsModal, setShowPricingDetailsModal] = React.useState({
    visible: false,
    data: null,
  });
  const [prices, setPrices] = React.useState([]);

  const {
    data: medicationsCategoriesData,
    isLoading: isLoadingDiagnosisCategories,
  } = useQuery('medicationsCategoriesData', () =>
    api.medications.getMedicationCategory(),
  );

  const handleCreateMedication = (formValues) => {
    addMedicationMutation.mutate({
      ...formValues,
      price_details: prices.map((price_detail) => ({
        ...price_detail,
        client_price_per_unit: price_detail.client_price_per_unit,
        weight: price_detail.weight,
        volume: Number(price_detail.volume),
        package: price_detail.package,
        weight_unit: 'lbs',
        currency: 'USD',
      })),

      clinic_id: clinics[0].serialId,
    });
  };

  const addMedicationMutation = useMutation(
    (addMedicationData) => api.medications.createMedication(addMedicationData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Medication has been successfully added',
          description: `You just added a new medication!`,
        });
        onCreateDone();
        addMedicationForm.resetFields();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Medication Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const togglePricingModal = (visible, data) => {
    setShowPricingDetailsModal({
      visible,
      data,
    });
  };

  const handleEditPriceButtonClick = (data) => {
    togglePricingModal(true, data);
  };

  const handleAddPrice = (price) => {
    setPrices([
      ...prices,
      {
        ...price,
        id: prices.length + 1,
      },
    ]);
    togglePricingModal(false, null);
  };

  const handleEditPrice = (pricingData) => {
    const newPrices = prices.map((price) => {
      if (price.id === pricingData.id) {
        return pricingData;
      }
      return price;
    });
    setPrices(newPrices);
    togglePricingModal(false, null);
  };

  const handleDeletePrice = (id) => {
    const newPrices = prices.filter((price) => price.id !== id);
    setPrices(newPrices);
  };

  const measureFieldValues = [
    'tablet',
    'injectable',
    'bag',
    'oral suspension',
    'suspension',
    'solution',
    'box',
    'bottle',
    'packet',
    'Container',
    'kit',
    'tube',
    'liquid',
    'Chewable',
    'capsule',
    'lotion',
  ];

  const columns = [
    {
      title: 'Weight',
      dataIndex: 'weight_class',
      render: (text, record) => (
        <span>{`${text ? `${text}${record?.weight_unit || ''}` : 'N/A'}`}</span>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      render: (text, record) => (
        <span>{`${text ? `${text}${record?.volume_unit || ''}` : 'N/A'}`}</span>
      ),
    },
    {
      title: 'Package',
      dataIndex: 'package',
      render: (text, record) => (
        <span>{`${
          text ? `${text}${record?.package_unit || 'pack'}` : 'N/A'
        }`}</span>
      ),
    },
    {
      title: 'Price Per Unit',
      dataIndex: 'client_price_per_unit',
      render: (text) => (
        <span>{`${text ? `$${(+text).toFixed(2)}` : 'N/A'}`}</span>
      ),
    },
    {
      title: 'Dispensing Fee',
      dataIndex: 'dispensing_fee',
      render: (text) => (
        <span>{`${text ? `$${(+text).toFixed(2)}` : 'N/A'}`}</span>
      ),
    },
    {
      title: 'Taxable',
      dataIndex: 'taxable',
      render: (taxable) => (taxable ? 'Yes' : 'No'),
    },
    {
      title: '',
      render: (text, record) => (
        <>
          <Button
            type="dashed"
            key={text}
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePrice(record?.id)}
          ></Button>
          <Button
            type="dashed"
            key={text}
            icon={<EditOutlined />}
            onClick={() => handleEditPriceButtonClick(record)}
          ></Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Form
        layout="vertical"
        form={addMedicationForm}
        onFinish={handleCreateMedication}
      >
        <Row gutter={[30, 10]}>
          <Col span={12}>
            <Form.Item
              label="Medication Category"
              name="category_id"
              required={false}
            >
              <Select
                className="custom-select"
                size="large"
                placeholder="Select a category"
                loading={isLoadingDiagnosisCategories}
                filterOption={(input, option) =>
                  option?.children
                    ?.toLowerCase()
                    ?.includes(input?.toLowerCase())
                }
                optionFilterProp="children"
                showSearch
              >
                {medicationsCategoriesData &&
                  medicationsCategoriesData?.data?.categories?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[30, 10]}>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              name="product_name"
              required={false}
              rules={[{ required: true, message: 'Enter product name' }]}
            >
              <CustomInput size="large" type="text" placeholder="" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Measure"
              name="measure"
              required={false}
              rules={[{ required: true, message: 'Ensure measure' }]}
            >
              <Select
                className="custom-select"
                showSearch
                size="large"
                placeholder="Select a measure"
                filterOption={(input, option) =>
                  option?.children
                    ?.toLowerCase()
                    ?.includes(input?.toLowerCase())
                }
                optionFilterProp="children"
              >
                {measureFieldValues?.map((measure, index) => (
                  <Option key={index} value={measure}>
                    {measure}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item
              label="Dose Instructions"
              name="dose_instructions"
              required={false}
              rules={[{ required: true, message: 'Enter dose instructions' }]}
            >
              <TextArea
                className="custom-textarea"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Pricing</Divider>

        <ConfigProvider
          renderEmpty={() => (
            <Empty
              description={
                'Prices have not been assigned. Get started by clicking: Add Price.'
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        >
          <Table
            columns={columns}
            size="small"
            dataSource={prices}
            pagination={false}
          />
        </ConfigProvider>
        <Row justify="center">
          <Col span={4}>
            <Form.Item>
              <Button
                type="primary"
                ghost
                onClick={() => togglePricingModal(true, null)}
                icon={<PlusOutlined />}
                style={{ marginTop: 20 }}
              >
                Add Price
              </Button>
            </Form.Item>
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
              addMedicationMutation.isLoading && !addMedicationMutation.isError
            }
          >
            Add Medication
          </Button>
        </Row>
      </Form>

      {showPricingDetailsModal?.visible && (
        <PricingDetailsModal
          visible={showPricingDetailsModal?.visible}
          onClose={() => togglePricingModal(false, null)}
          pricingData={showPricingDetailsModal?.data}
          onAdd={handleAddPrice}
          onEdit={handleEditPrice}
        />
      )}
    </>
  );
};

CreateMedicationsForm.propTypes = {
  onCreateDone: PropTypes.func.isRequired,
};

export default CreateMedicationsForm;
