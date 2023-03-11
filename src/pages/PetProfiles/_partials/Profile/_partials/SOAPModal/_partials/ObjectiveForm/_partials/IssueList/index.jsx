// react
import React from 'react';

import PropTypes from 'prop-types';

// components
import { Select } from 'antd';

const { Option } = Select;

// styles
import './index.less';

const IssueList = ({
  issueList,
  isLoadingIssues,
  onValueChange,
  issueType,
  disabled,
  defaultValue,
}) => {
  const handleOnValueChange = (values) => {
    onValueChange(issueType, 'issues', values);
  };
  return (
    <div className="issue-list">
      <Select
        mode="multiple"
        className="custom-select"
        size="medium"
        placeholder="Add Differentials"
        style={{ width: '100%', marginBottom: 10 }}
        onChange={handleOnValueChange}
        loading={isLoadingIssues}
        disabled={disabled}
        value={defaultValue}
        optionFilterProp="children"
      >
        {issueList?.map((value) => (
          <Option key={value?.id} value={value?.id}>
            {value?.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

IssueList.propTypes = {
  issueList: PropTypes.array.isRequired,
  isLoadingIssues: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
  issueType: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.array,
};

IssueList.defaultProps = {
  defaultValue: [],
};

export default IssueList;
