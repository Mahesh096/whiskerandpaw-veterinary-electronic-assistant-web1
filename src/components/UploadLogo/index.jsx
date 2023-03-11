// react libraries
import React, { useContext, useEffect, useState } from 'react';

// third-party libraries
import { Upload, Modal, notification, Avatar } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';

import PropTypes from 'prop-types';

//styles
import './index.less';

import LogoClinic from 'imgs/LogoClinic.jpg';

//components
import { AppStateContext } from 'AppContext';
import api from 'api';

const UploadLogo = ({ handleAvatar, avatar }) => {
  const { clinics } = useContext(AppStateContext);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [url, setUrl] = useState(LogoClinic);

  const { refetch } = useQuery(
    'getAvatar',
    () => api.clinic.getAvatar(clinics[0].serialId),
    {
      enabled: false,
    },
  );

  useEffect(() => {
    handleAvatar(url);
  }, [url]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleRemove = () => {
    setUrl(LogoClinic);
    handleAvatar(LogoClinic);
  };

  const getCleanUrl = (url) => {
    return url ? url.split('?')[0] : '';
  };

  const handleChange = async (options) => {
    const { onSuccess, onError, file } = options;
    if (file) {
      await refetch().then(async (result) => {
        const url = result.data.data.uploadURL;

        await axios
          .put(url, file, {
            headers: {
              'Content-Type': file.type,
            },
          })
          .then(() => {
            handleAvatar(getCleanUrl(url));
            setUrl(getCleanUrl(url));
            onSuccess('Uploaded');
          })
          .catch((error) => {
            notification.error({
              message: 'Form Error',
              description: `${error.message}`,
            });
            onError('Error uploading');
          });
      });
    }
    return null;
  };

  return (
    <div id="upload-avatar">
      <div className="upload">
        <div>
          <Avatar
            className="avatar"
            size={100}
            src={avatar && url === LogoClinic ? avatar : url}
          />
        </div>
        <div>
          <Upload
            onPreview={handlePreview}
            customRequest={handleChange}
            maxCount={1}
            onRemove={handleRemove}
            accept="mage/*"
          >
            <span className="add-logo">Add Hospital Logo</span>
          </Upload>
        </div>
      </div>
      <div>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            style={{ width: '100%' }}
            src={avatar && url === LogoClinic ? avatar : url}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UploadLogo;

UploadLogo.propTypes = {
  handleAvatar: PropTypes.func.isRequired,
  avatar: PropTypes.string,
};
