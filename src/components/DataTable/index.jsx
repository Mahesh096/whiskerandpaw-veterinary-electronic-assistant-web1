// react libraries
import React, { useState } from 'react';

// third-party libraries
import { Button, ConfigProvider, Empty, Table } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

// components
import Card from 'components/Card';
import { CustomInputSearch } from 'components/CustomInput';

// utils
import { sortBy } from 'utils/sort';

// styles
import './index.less';

const DataTable = ({
  extraElements,
  hasSearch,
  hasExportButton,
  columns,
  dataSource,
  loading,
  noDataMessage,
  ...props
}) => {
  const [searchText, setSearchText] = useState('');

  const filter = (array) => {
    if (dataSource) {
      if (searchText !== '' && !loading) {
        return array.filter((res) => {
          return Object.values(res).find((res) =>
            res
              ?.toString()
              .toLowerCase()
              .includes(searchText.toString().toLowerCase()),
          );
        });
      } else {
        return array;
      }
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div id="data-table">
      <Card
        extra={
          <div className="header-elements-container">
            <div className="default-elements">
              {hasSearch && (
                <CustomInputSearch
                  enterButton
                  style={{ marginRight: 15 }}
                  onChange={handleSearch}
                />
              )}

              {hasExportButton && (
                <Button icon={<CloudDownloadOutlined />}>
                  Export Data / Print
                </Button>
              )}
            </div>

            <div className="extra-elements">{extraElements}</div>
          </div>
        }
      >
        <ConfigProvider
          renderEmpty={() => (
            <Empty
              description={
                noDataMessage ||
                'It looks like our database has no data for this. Go ahead and add some!'
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        >
          <Table
            columns={columns}
            dataSource={sortBy(filter(dataSource && dataSource), {
              prop: 'created_at',
              desc: true,
            })}
            scroll={{ y: 'calc(100vh - 438px)' }}
            loading={loading}
            {...props}
          />
        </ConfigProvider>
      </Card>
    </div>
  );
};

DataTable.defaultProps = {
  loading: false,
};

DataTable.propTypes = {
  extraElements: PropTypes.elementType,
  hasSearch: PropTypes.bool,
  hasExportButton: PropTypes.bool,
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  noDataMessage: PropTypes.string,
};
export default DataTable;
