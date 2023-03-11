import {
  Drawer,
  Form,
  Row,
  Col,
  Input,
  Select,
  Switch,
  InputNumber,
  Button,
} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const PricingDetailsModal = ({
  pricingData,
  onClose,
  visible,
  onAdd,
  onEdit,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    pricingData &&
      form.setFieldsValue({
        ...pricingData,
        package_unit: pricingData.package_unit || 'pack',
      });
  }, [pricingData]);

  const volumeFieldValues = [
    'mg',
    'mL',
    'kg',
    'oz',
    'mg/mL',
    'g',
    'count',
    'chews',
    'lb ',
  ];

  const packageUnits = ['pack', 'count'];

  const handleSubmit = (formValues) => {
    pricingData
      ? onEdit({
          ...pricingData,
          ...formValues,
          weight_unit: 'lbs',
          currency: 'USD',
          client_price_per_unit: (+formValues.client_price_per_unit).toFixed(2),
          dispensing_fee: (+formValues.dispensing_fee).toFixed(2),
        })
      : onAdd({
          ...formValues,
          weight_unit: 'lbs',
          currency: 'USD',
          client_price_per_unit: (+formValues.client_price_per_unit).toFixed(2),
          dispensing_fee: (+formValues.dispensing_fee).toFixed(2),
        });
  };

  return (
    <Drawer
      title={`${pricingData ? `Edit Pricing` : `Add Pricing`}`}
      placement="right"
      onClose={onClose}
      visible={visible}
      style={{ position: 'absolute' }}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[30, 10]}>
          <Col span={24}>
            <Form.Item name={'weight_class'} label="Weight Class">
              <Input suffix="lbs" placeholder="Weight Class" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name={'package'} label="Package">
              <Input
                addonAfter={
                  <Form.Item name={'package_unit'} initialValue="pack" noStyle>
                    <Select style={{ width: 100 }}>
                      {packageUnits?.map((unit, index) => (
                        <Option key={index} value={unit}>
                          {unit}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
                placeholder=""
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Price Per Unit" name={'client_price_per_unit'}>
              <InputNumber
                defaultValue={0}
                prefix={'$'}
                precision={2}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Dispensing Fee" name={'dispensing_fee'}>
              <InputNumber
                defaultValue={0}
                prefix={'$'}
                precision={2}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Taxable?"
              name={'taxable'}
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Taxable"
                unCheckedChildren="Not Taxable"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Volume" name={'volume'}>
              <Input
                addonAfter={
                  <Form.Item name={'volume_unit'} initialValue="kg" noStyle>
                    <Select style={{ width: 100 }}>
                      {volumeFieldValues?.map((volume, index) => (
                        <Option key={index} value={volume}>
                          {volume}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
                placeholder="Volume"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={4}>
            <Form.Item>
              <Button
                type="primary"
                ghost
                htmlType="submit"
                icon={<PlusOutlined />}
              >
                {pricingData ? 'Save Changes' : 'Add Price'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

PricingDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  pricingData: PropTypes.object,
};

export default PricingDetailsModal;
