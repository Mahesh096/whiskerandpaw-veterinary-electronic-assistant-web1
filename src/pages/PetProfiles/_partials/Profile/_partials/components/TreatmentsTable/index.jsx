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
  ConfigProvider,
  Empty,
} from 'antd';
import PropTypes from 'prop-types';
import { EditOutlined, DeleteOutlined, BulbOutlined } from '@ant-design/icons';

const { Option } = Select;

const TreatmentsTable = ({
  tableData,
  dropdownData,
  dropdownValue,
  onChangeDropdown,
  customTableColumns,
  isLoadingTableData,
  isLoadingDropdownData,
  handleRemoveItemfromTreatmentsTable,
  toggleEditTreatmentModal,
}) => {
  const txSugguestionColumn = [
    {
      title: '',
      key: 1,
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
      title: 'Treatment Name',
      dataIndex: 'name',
      key: 2,
      fixed: 'left',
      width: 200,
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name || 'N/A'}
        </Tooltip>
      ),
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 4,
      ellipsis: {
        showTitle: false,
      },
      render: (cost) => (
        <Tooltip placement="topLeft" title={cost}>
          {cost ? <>{`$${cost}`}</> : 'N/A'}
        </Tooltip>
      ),
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      key: 5,
      ellipsis: {
        showTitle: false,
      },
      render: (tax) => (
        <Tooltip placement="topLeft" title={tax}>
          {tax || 'N/A'}
        </Tooltip>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 6,
      fixed: 'right',
      ellipsis: {
        showTitle: false,
      },
      render: (total) => (
        <Tooltip placement="topLeft" title={total}>
          <> {total ? <>{`$ ${total}`}</> : 'N/A'}</>
        </Tooltip>
      ),
      width: 100,
    },
  ];

  const treatmentColumns = [
    ...txSugguestionColumn,
    {
      title: '',
      key: 7,
      render: function Actions(record) {
        return (
          <>
            <Popconfirm
              title={`Are you sure to remove ${record?.name}`}
              onConfirm={() => handleRemoveItemfromTreatmentsTable(record)}
              onCancel={() => {}}
              okText="Remove"
              cancelText="Cancel"
            >
              <Button type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
            <Popconfirm
              title={`Are you sure to edit ${record?.name}`}
              onConfirm={() => toggleEditTreatmentModal(true, record)}
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
          <span className="primary-tag-outline">Treatments</span>
          <div style={{ margin: 10 }}>
            <Select
              mode="multiple"
              placeholder="Search and add another treatment"
              loading={isLoadingDropdownData}
              onChange={onChangeDropdown}
              style={{ width: '100%', marginRight: 10 }}
              value={dropdownValue}
              size="large"
              optionFilterProp="children"
              showSearch
            >
              {dropdownData?.map((item) => (
                <Option key={item.name} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <ConfigProvider
              renderEmpty={() => (
                <Empty
                  description={
                    'Treatments were not generated. Feel free to search and add as many as you need!'
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            >
              <Table
                columns={
                  customTableColumns?.length
                    ? customTableColumns
                    : treatmentColumns
                }
                dataSource={tableData}
                pagination={{ position: ['none', 'none'] }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="expanded-table-content-container">
                      <div>
                        <h5>Service/Treatment Description:</h5>
                        <p>{record.description}</p>
                      </div>
                      <div>
                        <h5>Category</h5>
                        <p>{record.category}</p>
                      </div>
                    </div>
                  ),
                  columnWidth: customTableColumns?.length ? 5 : 40,
                }}
                loading={isLoadingTableData}
              />
            </ConfigProvider>
          </div>
        </div>
      </Col>
    </Row>
  );
};

TreatmentsTable.defaultProps = {
  customTableColumns: [],
};

TreatmentsTable.propTypes = {
  dropdownData: PropTypes?.array.isRequired,
  isLoadingDropdownData: PropTypes.bool.isRequired,
  onChangeDropdown: PropTypes.func.isRequired,
  dropdownValue: PropTypes?.array.isRequired,
  customTableColumns: PropTypes.array,
  tableData: PropTypes?.array.isRequired,
  isLoadingTableData: PropTypes?.bool.isRequired,
  handleRemoveItemfromTreatmentsTable: PropTypes?.func.isRequired,
  toggleEditTreatmentModal: PropTypes?.func.isRequired,
};

export default TreatmentsTable;
