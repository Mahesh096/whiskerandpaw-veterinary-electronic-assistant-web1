import React from 'react';

// third-party libraries
import {
  Button,
  Row,
  Col,
  Table,
  Tooltip,
  Select,
  Popconfirm,
  InputNumber,
  ConfigProvider,
  Empty,
} from 'antd';
import PropTypes from 'prop-types';
import { EditOutlined, DeleteOutlined, BulbOutlined } from '@ant-design/icons';

const { Option } = Select;

const MedicationsTable = ({
  dropdownData,
  isLoadingDropdownData,
  onChangeDropdown,
  dropdownValue,
  extraTableColumns,
  tableData,
  isLoadingTableData,
  handleRemoveItemfromMedicationsTable,
  handleMedicationVolumeChange,
  handleMedicationQuantityChange,
  toggleEditMedicationModal,
}) => {
  const medicationColumns = [
    {
      title: '',
      width: 30,
      render: (text, record) =>
        record?.ai && (
          <Tooltip placement="topLeft" title={'🐾 VEA recommended'} key="text">
            <BulbOutlined />
          </Tooltip>
        ),
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 100,

      ellipsis: {
        showTitle: false,
      },
      render: (product_name) => (
        <Tooltip placement="topLeft" title={product_name}>
          {product_name}
        </Tooltip>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: '',
      key: 'quantity',
      width: 130,
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <>
          <InputNumber
            onChange={(value) => handleMedicationQuantityChange(value, record)}
            defaultValue={1}
            min={1}
            key={text}
          />
        </>
      ),
    },
    {
      title: 'Volume',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <>
          <Select
            key={text}
            size="large"
            placeholder="Select a volume"
            optionFilterProp="children"
            style={{ width: '100%' }}
            defaultValue={
              record?.price_details &&
              `${Number(record?.price_details[0]?.volume) || 1} ${
                record?.price_details[0]?.volume_unit || ''
              }`
            }
            onChange={(value) => handleMedicationVolumeChange(value, record)}
          >
            {record?.price_details?.map((details, index) => (
              <Option key={index} value={details?.id}>
                {Number(details?.volume) || 1}
                {details.volume_unit || ''}
              </Option>
            ))}
          </Select>
        </>
      ),
      width: 100,
    },
    {
      title: 'Total Price',
      dataIndex: 'client_total_price',
      key: 'client_total_price',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        return (
          <span key={text}>
            {' $'}
            {(
              Number(record?.current_price_details?.quantity || 1) *
              (Number(
                record?.current_price_details?.client_price_per_unit || 0,
              ) || record?.price_details[0]?.cost)
            ).toFixed(2)}{' '}
          </span>
        );
      },
      width: 100,
    },
    ...extraTableColumns,
  ];

  const medicationSuggestionColumns = [
    ...medicationColumns,
    {
      title: '',
      render: function Actions(record) {
        return (
          <>
            <Popconfirm
              title={`Are you sure to remove ${record?.product_name}`}
              onConfirm={() => handleRemoveItemfromMedicationsTable(record)}
              onCancel={() => {}}
              okText="Remove"
              cancelText="Cancel"
            >
              <Button type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
            <Popconfirm
              title={`Are you sure to edit ${record?.product_name}`}
              onConfirm={() => toggleEditMedicationModal(true, record)}
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

  return (
    <Row>
      <Col span={24}>
        <div className="list-container">
          <span className="primary-tag-outline">Medications</span>
          <div style={{ margin: 10 }}>
            <Select
              mode="multiple"
              placeholder="Search and add another medication"
              loading={isLoadingDropdownData}
              onChange={onChangeDropdown}
              style={{ width: '100%', marginRight: 10 }}
              value={dropdownValue}
              size="large"
              optionFilterProp="children"
              showSearch
            >
              {dropdownData?.map((item) => (
                <Option key={item.product_name} value={item.product_name}>
                  {item.product_name} {item.volume} {item.measure}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <ConfigProvider
              renderEmpty={() => (
                <Empty
                  description={
                    'No medications were specified. Please search and add a medication.'
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            >
              <Table
                columns={medicationSuggestionColumns}
                dataSource={tableData}
                pagination={{ position: ['none', 'none'] }}
                loading={isLoadingTableData}
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="expanded-table-content-container">
                      <div>
                        <h5>Dose Instructions: </h5>
                        <p>{record.dose_instructions || 'Not Specified'}</p>
                      </div>
                      <div>
                        <h5>Symptoms: </h5>
                        <p>{record.symptoms || 'Not Specified'}</p>
                      </div>
                      <div>
                        <h5>Plan Description: </h5>
                        <p>{record.plan_description || 'Not Specified'}</p>
                      </div>
                      <div>
                        <h5>Category: </h5>
                        <p>{record.category || 'Not Specified'}</p>
                      </div>
                      <div>
                        <h5>Measure: </h5>
                        <p>{record.measure || 'Not Specified'}</p>
                      </div>
                    </div>
                  ),
                  columnWidth: 20,
                }}
              />
            </ConfigProvider>
          </div>
        </div>
      </Col>
    </Row>
  );
};

MedicationsTable.defaultProps = {
  extraTableColumns: [],
};

MedicationsTable.propTypes = {
  dropdownData: PropTypes?.array.isRequired,
  isLoadingDropdownData: PropTypes.bool.isRequired,
  onChangeDropdown: PropTypes.func.isRequired,
  dropdownValue: PropTypes?.array.isRequired,
  extraTableColumns: PropTypes.array,
  tableData: PropTypes?.array.isRequired,
  isLoadingTableData: PropTypes?.bool.isRequired,
  handleMedicationVolumeChange: PropTypes?.func.isRequired,
  handleMedicationQuantityChange: PropTypes?.func.isRequired,
  handleRemoveItemfromMedicationsTable: PropTypes?.func.isRequired,
  toggleEditMedicationModal: PropTypes?.func.isRequired,
};

export default MedicationsTable;
