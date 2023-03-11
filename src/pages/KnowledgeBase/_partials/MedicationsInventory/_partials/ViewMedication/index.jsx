// react libraries
import React from 'react';

// third-party libraries
import { Modal, Descriptions, Table } from 'antd';
import PropTypes from 'prop-types';

// utils
import convertDataString from 'utils/convertDataString';

const ViewMedication = ({ visible, onCancel, medicationData }) => {
  const columns = [
    {
      title: 'Weight',
      dataIndex: 'weight',
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
      render: (text) => <span>{text || 'N/A'}</span>,
    },
    {
      title: 'Price Per Unit',
      dataIndex: 'client_price_per_unit',
      render: (text, record) => (
        <span>{`${text ? `${text}${record?.currency || ''}` : 'N/A'}`}</span>
      ),
    },
    {
      title: 'Dispensing Fee',
      dataIndex: 'dispensing_fee',
      render: (text, record) => (
        <span>{`${text ? `${text}${record?.currency || ''}` : 'N/A'}`}</span>
      ),
    },
    {
      title: 'Taxable',
      dataIndex: 'taxable',
      render: (taxable) => (taxable ? 'Yes' : 'No'),
    },
  ];

  return (
    <Modal
      title={medicationData.product_name}
      onCancel={onCancel}
      visible={visible}
      width={750}
      className="custom-modal"
      okText="Create"
      footer={null}
    >
      <Descriptions layout="vertical" bordered column={2}>
        <Descriptions.Item label="Created On">
          {convertDataString(medicationData.created_at) || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Product Name">
          {medicationData.product_name || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Category">
          {medicationData.category || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Symptoms">
          {medicationData.symptoms || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Drug Code" span={2}>
          {medicationData.drug_code || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Measure">
          {medicationData.measure || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Dose Instructions" span={2}>
          {medicationData.dose_instructions || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Pricing" span={2}>
          <Table
            columns={columns}
            size="small"
            dataSource={medicationData?.price_details}
            pagination={false}
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

ViewMedication.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreateButtonClick: PropTypes.func.isRequired,
  medicationData: PropTypes.object.isRequired,
};

export default ViewMedication;
