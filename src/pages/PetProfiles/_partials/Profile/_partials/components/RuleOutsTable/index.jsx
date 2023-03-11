import React from 'react';

// third-party libraries
import PropTypes from 'prop-types';
import { DeleteOutlined, BulbOutlined, EditOutlined } from '@ant-design/icons';
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

const { Option } = Select;

const RuleOutsTable = ({
  tableData,
  isRuleOut,
  dropdownData,
  dropdownValue,
  onChangeDropdown,
  showTableActions,
  extraTableColumns,
  isLoadingTableData,
  isLoadingDropdownData,
  toggleEditDiagnosisModal,
  handleRemoveItemfromFRuleOutsTable,
}) => {
  const ruleOutcolumns = [
    {
      title: '',
      width: 30,
      render: (text, record) =>
        record?.ai && (
          <Tooltip placement="topLeft" title={'🐾 VEA recommended'} key={text}>
            <BulbOutlined />
          </Tooltip>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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

      ellipsis: {
        showTitle: false,
      },
      render: (category) => <span> {category || 'N/A'}</span>,
    },
    ...extraTableColumns,
    {
      title: '',
      render: function Actions(record) {
        return (
          <>
            {!!showTableActions && (
              <>
                <Popconfirm
                  title={`Are you sure to remove ${record?.name}`}
                  onConfirm={() => handleRemoveItemfromFRuleOutsTable(record)}
                  onCancel={() => {}}
                  okText="Remove"
                  cancelText="Cancel"
                >
                  <Button type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
                <Popconfirm
                  title={`Are you sure to edit ${record?.name}`}
                  onConfirm={() => toggleEditDiagnosisModal(true, record)}
                  onCancel={() => {}}
                  okText="Edit"
                  cancelText="Cancel"
                >
                  <Button type="text" icon={<EditOutlined />} />
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <div className="list-container">
          <span className="primary-tag-outline">
            {isRuleOut ? 'Rule Outs' : 'Diagnosis'}
          </span>
          <div style={{ margin: 10 }}>
            <Select
              mode="multiple"
              placeholder={`Search and add another ${
                isRuleOut ? 'rule out' : 'diagnosis'
              }`}
              loading={isLoadingDropdownData}
              onChange={onChangeDropdown}
              style={{ width: '100%', marginRight: 10 }}
              value={dropdownValue}
              size="large"
              optionFilterProp="children"
              showSearch
            >
              {dropdownData?.map((item) => (
                <Option key={item.id} value={item.id}>
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
                    'Diagnosis could be determined. Please search and add a diagnosis.'
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            >
              <Table
                columns={ruleOutcolumns}
                dataSource={tableData}
                pagination={{ position: ['none', 'none'] }}
                loading={isLoadingTableData}
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="expanded-table-content-container">
                      <div>
                        <h5>Description:</h5>
                        <p>{record.description}</p>
                      </div>
                      <div>
                        <h5>Common Symptops:</h5>
                        <p>{record.symptoms}</p>
                      </div>
                    </div>
                  ),
                  columnWidth: 40,
                }}
              />
            </ConfigProvider>
          </div>
        </div>
      </Col>
    </Row>
  );
};

RuleOutsTable.defaultProps = {
  extraTableColumns: [],
  isRuleOut: true,
  showTableActions: true,
};

RuleOutsTable.propTypes = {
  dropdownData: PropTypes?.array.isRequired,
  isLoadingDropdownData: PropTypes.bool.isRequired,
  onChangeDropdown: PropTypes.func.isRequired,
  dropdownValue: PropTypes?.array.isRequired,
  extraTableColumns: PropTypes.array,
  tableData: PropTypes?.array.isRequired,
  isLoadingTableData: PropTypes?.bool.isRequired,
  handleRemoveItemfromFRuleOutsTable: PropTypes?.func,
  isRuleOut: PropTypes.bool,
  toggleEditDiagnosisModal: PropTypes?.func,
  showTableActions: PropTypes.bool.isRequired,
};

export default RuleOutsTable;
