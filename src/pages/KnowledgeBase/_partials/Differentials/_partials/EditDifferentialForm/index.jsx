// react libraries
import React, { useEffect } from 'react';

// third-party libraries
import { useMutation, useQuery } from 'react-query';
import { Form, Row, Col, Button, notification, Select, Skeleton } from 'antd';
import PropTypes from 'prop-types';

// components
import { CustomInput } from 'components/CustomInput';

// API Client
import api from 'api';

const { Option } = Select;

const EditDifferentialForm = ({ onEditDone, editData, isViewDifferential }) => {
  const [editDifferentialForm] = Form.useForm();

  useEffect(() => {
    getDifferential();
  }, [editData?.id]);

  const {
    data: differentialCategoriesData,
    isLoading: isLoadingDifferentialCategories,
  } = useQuery('differentialCategory', () =>
    api.differentials.getDifferentialCategory(),
  );

  const {
    data: differentialData,
    isFetching: isFetchingDifferential,
    refetch: getDifferential,
  } = useQuery(
    ['differential', editData?.id],
    () => api.differentials.getDifferential(editData?.id),
    {
      onSuccess(data) {
        editDifferentialForm.setFieldsValue({
          name: data?.data?.differential?.name,
          category_id: data?.data?.differential?.category_id,
          diagnosis: [
            ...new Set(
              data?.data?.differential?.diagnosis?.map((diag) => diag?.id),
            ),
          ],

          treatments: [
            ...new Set(
              data?.data?.differential?.treatments?.map((trt) => trt?.id),
            ),
          ],
        });
      },
      enabled: !!editData?.id,
      cacheTime: 0,
    },
  );

  const editDifferentialMutation = useMutation(
    (addDiagnosisData) => api.differentials.editDifferential(addDiagnosisData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Differential has been successfully added',
          description: `You just added a new Differential!`,
        });
        editDifferentialForm.resetFields();
        onEditDone();
      },
      onError: (error) => {
        notification.error({
          message: 'Add Differential Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  const handleAddDiagnosis = (formValues) => {
    editDifferentialMutation.mutate({
      ...formValues,
      category:
        differentialCategoriesData?.data?.differentials.filter(
          (dif) => dif?.id === formValues.category_id,
        )[0]?.name || '',
      main_category_id: 1,
      id: differentialData?.data?.differential?.id,
      diagnosis: [],
      treatments: [],
    });
  };

  return (
    <Form
      layout="vertical"
      form={editDifferentialForm}
      onFinish={handleAddDiagnosis}
    >
      {!!isFetchingDifferential && <Skeleton />}

      {!isFetchingDifferential && (
        <>
          <Row gutter={[30, 10]}>
            <Col span={12}>
              <Form.Item
                label="Differential Name"
                name="name"
                required={false}
                rules={[{ required: true, message: 'Enter differential name' }]}
              >
                <CustomInput
                  size="large"
                  type="text"
                  placeholder=""
                  disabled={isViewDifferential}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Differential Category"
                name="category_id"
                required={false}
                rules={[
                  { required: true, message: 'Select differential category' },
                ]}
              >
                <Select
                  className="custom-select"
                  size="large"
                  placeholder="Select category"
                  loading={isLoadingDifferentialCategories}
                  disabled={isViewDifferential}
                >
                  {differentialCategoriesData &&
                    differentialCategoriesData?.data?.differentials?.map(
                      (item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ),
                    )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!isViewDifferential && (
            <Row justify="end">
              <Button
                size="large"
                type="primary"
                className="custom-button"
                style={{ marginTop: 40 }}
                htmlType="submit"
                loading={editDifferentialMutation.isLoading}
              >
                Save Changes
              </Button>
            </Row>
          )}
        </>
      )}
    </Form>
  );
};

EditDifferentialForm.propTypes = {
  onEditDone: PropTypes.func.isRequired,
  isViewDifferential: PropTypes?.bool?.isRequired,
  editData: PropTypes?.object,
};

export default EditDifferentialForm;
