// react libraries
import React from 'react';

// third-party components
import { Input } from 'antd';

// styles
import './index.less';

const CustomInput = (props) => {
  return <Input className="custom-input" {...props} />;
};

const CustomInputSearch = (props) => {
  return <Input.Search className="custom-input" {...props} />;
};

const CustomInputPassword = (props) => {
  return <Input.Password className="custom-input" {...props} />;
};

export { CustomInput, CustomInputSearch, CustomInputPassword };
