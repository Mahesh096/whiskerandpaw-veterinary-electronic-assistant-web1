// react libraries
import React, { useEffect, useState } from 'react';

// third-party libraries
import { Form, Button, Input } from 'antd';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const TextAreaWithMic = ({
  form,
  label,
  required,
  rules,
  name,
  autoSize,
  value,
  onChange,
}) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [micField, setMicField] = useState('');

  useEffect(() => {
    if (micField === `${name}`) {
      form.setFieldsValue({
        [name]: transcript,
      });

      onChange && onChange({ target: { value: transcript } });
    }
  }, [transcript, name, micField]);

  useEffect(() => {
    value &&
      form.setFieldsValue({
        [name]: value,
      });
  }, [value]);

  useEffect(() => {
    // if the field is not null, then start listening
    if (micField === `${name}`) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [micField]);

  return (
    <div style={{ position: 'relative' }}>
      <Form.Item name={name} label={label} required={required} rules={rules}>
        <TextArea
          className="custom-textarea"
          placeholder={'Comments...'}
          autoSize={autoSize || { minRows: 4, maxRows: 7 }}
          value={value}
          onChange={onChange}
        />
      </Form.Item>

      {micField === `${name}` ? (
        <Button
          type={'text'}
          shape={'default'}
          icon={<AudioMutedOutlined />}
          style={{ position: 'absolute', bottom: '9px', right: '13px' }}
          danger={true}
          onClick={() => {
            setMicField('');
          }}
        >
          {listening && 'listening..'}
        </Button>
      ) : (
        <Button
          type={'primary'}
          shape={'circle'}
          icon={<AudioOutlined />}
          style={{ position: 'absolute', bottom: '9px', right: '13px' }}
          danger={false}
          onClick={() => {
            setMicField(`${name}`);
          }}
        ></Button>
      )}
    </div>
  );
};

TextAreaWithMic.propTypes = {
  form: PropTypes.object.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  autoSize: PropTypes.object,
  rules: PropTypes.array,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default TextAreaWithMic;
