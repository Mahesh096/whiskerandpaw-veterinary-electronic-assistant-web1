import React, { useContext, useEffect, useState } from 'react';

//third party libraries
import { Badge, Button, Col, DatePicker, Divider, Form, Modal, notification, Row, Select } from 'antd';
import { useMutation, useQuery } from 'react-query';
import PropTypes from 'prop-types';
import moment from 'moment';

//components
import { CustomInput } from 'components/CustomInput';
import { AppStateContext } from 'AppContext';

//API
import api from 'api';

const { Option } = Select;

const EditPetInformation = ({ visible, onCancel, isEditing, petDetails = [], getPetDetails, getAllPets }) => {

  const [petFormData] = Form.useForm();
  const [selectedVaccineCategory, setSelectedVaccineCategory] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const { clinics } = useContext(AppStateContext);

  useEffect(() => {
    if (isEditing) {
      const data = {
        ...petDetails,
        ...petDetails.vaccine_history,
        date_of_birth: moment(petDetails?.date_of_birth, 'YYYY-MM-DD'),
        weight: petDetails?.weight?.value,
        expirationDate: moment(petDetails?.vaccine_history?.expirationDate, 'MM/DD/YYYY'),
        reminderDate: moment(petDetails?.vaccine_history?.reminderDate, 'MM/DD/YYYY'),
      };
      petFormData.setFieldsValue(data);
      setExpirationDate(moment(petDetails?.vaccine_history?.expirationDate, 'MM/DD/YYYY'));
    }
  }, [petDetails]);

  //Add Pet
  const addPetMutation = useMutation((petData) => api.pet.addPet(petData), {
    onSuccess: () => {
      notification.success({
        message: 'Pet has been successfully created',
        description: `Pet has been successfully created.`,
      });
      petFormData.resetFields();
      getAllPets();
      onCancel();
    },
    onError: (error) => {
      notification.error({
        message: 'Pet Add Error',
        description: `${error.response.data.message}`,
      });
    },
  });

  //update
  const updateMutation = useMutation(
    (petData) => api.pet.editPet(petDetails.id, petData),
    {
      onSuccess: () => {
        notification.success({
          message: 'Pet has been successfully updated',
          description: `Pet has been successfully updated.`,
        });
        petFormData.resetFields();
        getPetDetails();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Pet Add Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  //Select
  const { data: breedData, isLoading: isLoadingBreed } = useQuery(
    'getBreedsData',
    () => api.breeds.getAllBreeds(),
  );
  const { data: colorData, isLoading: isLoadingColor } = useQuery(
    'getColorData',
    () => api.colors.getColors(),
  );
  const { data: genderData, isLoading: isLoadingGender } = useQuery(
    'getGenderData',
    () => api.genders.getAllGenders(),
  );

  const { data: vaccinesProduct, isLoading: isLoadingVaccineProduct } = useQuery(
    'getVaccineProduct',
    () => api.vaccines.getAllVaccines(),
  );

  const { data: vaccineCategory, isLoading: isLoadingVaccineCategories } = useQuery(
    'getVaccineCategories',
    () => api.vaccines.getVaccineCategories(),
  );

  const { data: petParents, isLoading: isLoadingPetParents } = useQuery(
    'getPetParents',
    () => api.petParents.getAllPetParents(clinics[0].serialId),
  );

  const onSelectBreed = (e) => {
    petFormData.setFieldsValue({ breedId: e });
  };

  const onSelectColor = (e, val) => {
    petFormData.setFieldsValue({ color: val.children });
  };

  const onSelectGender = (e, val) => {
    petFormData.setFieldsValue({ gender: val.children });
  };

  const onSelectVaccineCategory = (e, val) => {
    petFormData.setFieldsValue({ vaccineCategory: val.children });
    setSelectedVaccineCategory(val.children);
  };

  const onSelectProductName = (e, val) => {
    petFormData.setFieldsValue({ productName: val.children });
  };

  const onSelectPetParent = (e) => {
    petFormData.setFieldsValue({ petParent: e });
  };

  const toggleExpirationDate = (e) => {
    petFormData.setFieldsValue({ expirationDate: e });
    petFormData.setFieldsValue({ vaccineStatus: moment(e).format('MM/DD/YYYY') <= moment().format('MM/DD/YYYY') ? 'Overdue' : 'Current' });
    setExpirationDate(e);
  };

  const onFinish = (values) => {
    const vaccineHistory = {
      vaccineCategory: values.vaccineCategory,
      productName: values.productName,
      manufacturerName: values.manufacturerName,
      lotNumber: values.lotNumber,
      expirationDate: String(moment(values.expirationDate).format('MM/DD/YYYY')),
      reminderDate: String(moment(values.reminderDate).format('MM/DD/YYYY')),
      vaccineStatus: values.vaccineStatus,
    };

    const weight = {
      value: +values.weight,
      unit: 'lbs',
    };

    if (isEditing) {
      const petUpdatedData = {
        name: values.name,
        breedId: breedData?.data?.breeds.find((breed) => breed.breed === values.breed).id,
        dateOfBirth: String(moment(values.dateOfBirth).format('MM/DD/YYYY')),
        vaccineHistory,
        weight,
      };
      updateMutation.mutate(petUpdatedData);

    } else {
      //Adding new Pet
      const newPetData = {
        clinicId: clinics[0].serialId,
        parentId: values.petParent,
        petsArr: [
          {
            name: values.name,
            breedId: values.breed,
            dateOfBirth: String(moment(values.dateOfBirth).format('MM/DD/YYYY')),
            color: values.color,
            gender: values.gender,
            vaccineHistory,
            weight,
          },
        ],
      };
      addPetMutation.mutate(newPetData);
    }
  };

  const onFinishFailed = (values) => {
    notification.error({
      message: 'Form Field Error',
      description: `${values.errorFields[0].errors[0]}`,
    });
  };

  return (
    <>
      <div id='edit-pet-information'>
        <Modal
          title={`${isEditing ? 'Editing Pet Profile' : 'Add New Pet'}`}
          onCancel={onCancel}
          visible={visible}
          width={800}
          style={{ paddingTop: '1rem' }}
          className='custom-modal'
          footer={null}
        >
          <Form
            layout='vertical'
            name='pet-parent-form'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={petFormData}
          >
            <Divider orientation='start'>Basic Information</Divider>
            <Row gutter={[30, 10]} justify='center'>
              <Col span={12}>
                <Form.Item
                  label='Pet Name'
                  name='name'
                  rules={[{ required: true }]}
                >
                  <CustomInput type='text' size='large' placeholder='Pet Name' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Pet Breed'
                  name='breed'
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ lineHeight: 3.5 }}
                    className='ant-select ant-select-lg custom-select'
                    loading={isLoadingBreed}
                    placeholder='Select Breed'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onSelect={(e) => onSelectBreed(e)}
                  >
                    {!isLoadingBreed
                      ? breedData?.data?.breeds?.map((data, index) => {
                        return (
                          <Option key={index} value={data.id}>
                            {data.breed}
                          </Option>
                        );
                      })
                      : null}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[30, 10]} justify='center'>
              <Col span={12}>
                <Form.Item
                  label='Pet Color'
                  name='color'
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ lineHeight: 3.5 }}
                    className='ant-select ant-select-lg custom-select'
                    size='large'
                    loading={isLoadingColor}
                    placeholder='Select Color'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onSelect={(e, val) => onSelectColor(e, val)}
                  >
                    {!isLoadingColor
                      ? colorData?.data.colors?.map((data, index) => {
                        return (
                          <Option key={index} value={data.id}>
                            {data.color}
                          </Option>
                        );
                      })
                      : null}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Pet Gender'
                  name='gender'
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ lineHeight: 3.5 }}
                    className='ant-select ant-select-lg custom-select'
                    size='large'
                    loading={isLoadingGender}
                    placeholder='Select Gender'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onSelect={(e, val) => onSelectGender(e, val)}
                  >
                    {!isLoadingGender
                      ? genderData?.data?.genders?.map((data, index) => {
                        return (
                          <Option key={index} value={data.id}>
                            {data.gender}
                          </Option>
                        );
                      })
                      : null}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[30, 10]} justify='center'>
              <Col span={12}>
                <Form.Item
                  label='Date Of Birth'
                  name='date_of_birth'
                  rules={[
                    {
                      type: 'date',
                      message: 'Please input correct Date!',
                    },
                  ]}
                >
                  <DatePicker
                    size='large'
                    className='ant-input ant-input-lg custom-input'
                    picker='date'
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='weight'
                  label='Weight'
                  required={false}
                  rules={[{ required: true, message: `Enter pet's weight` }]}
                >
                  <CustomInput
                    className='ant-input ant-input-lg custom-input'
                    size='large'

                  />
                </Form.Item>
              </Col>
            </Row>
            {
              !isEditing &&
              <Row gutter={[30, 10]} justify='center'>
                <Col span={12}>
                  <Form.Item
                    label='Pet Parent'
                    name='petParent'
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      style={{ lineHeight: 3.5 }}
                      className='ant-select ant-select-lg custom-select'
                      size='large'
                      loading={isLoadingPetParents}
                      placeholder='Pet Parents'
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                      onSelect={(e, val) => onSelectPetParent(e, val)}
                    >
                      {!isLoadingPetParents
                        ? petParents?.data?.petParents?.map((data, index) => {
                          return (
                            <Option key={index} value={data.id}>
                              {`${data.first_name} ${data.last_name}`}
                            </Option>
                          );
                        })
                        : null}
                    </Select>

                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>

            }

            <Divider orientation='left'>Vaccine History & Reminders </Divider>
            <Row gutter={[30, 10]} justify='center'>
              <Col span={12}>
                <Form.Item
                  label='Vaccine Category'
                  name='vaccineCategory'
                  rules={[{ required: false }]}
                >
                  <Select
                    showSearch
                    style={{ lineHeight: 3.5 }}
                    className='ant-select ant-select-lg custom-select'
                    size='large'
                    loading={false}
                    placeholder='Vaccine Category'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onSelect={(e, val) => onSelectVaccineCategory(e, val)}
                  >
                    {!isLoadingVaccineCategories
                      ? vaccineCategory?.data?.categories?.map((data, index) => {
                        return (
                          <Option key={index} value={data.vaccine_category}>
                            {data.vaccine_category}
                          </Option>
                        );
                      })
                      : null}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Product Name'
                  name='productName'
                  rules={[{ required: false }]}
                >
                  <Select
                    showSearch
                    style={{ lineHeight: 3.5 }}
                    className='ant-select ant-select-lg custom-select'
                    size='large'
                    loading={false}
                    placeholder='Product Name'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onSelect={(e, val) => onSelectProductName(e, val)}
                  >
                    {!isLoadingVaccineProduct
                      ? vaccinesProduct?.data.vaccines?.filter((vaccine) => vaccine.category === selectedVaccineCategory).map((data, index) => {
                        return (
                          <Option key={index} value={data.id}>
                            {data.name}
                          </Option>
                        );
                      })
                      : null}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[30, 10]} justify='center'>
              <Col span={12}>
                <Form.Item
                  label='Manufacturer’s Name'
                  name='manufacturerName'
                  rules={[{ required: true }]}
                >
                  <CustomInput type='text' size='large' placeholder='Manufacturer’s Name' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Lot Number'
                  name='lotNumber'
                  rules={[{ required: true }]}
                >
                  <CustomInput type='text' size='large' placeholder='Lot Number' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[30, 10]} justify='center'>
              <Col span={12}>
                <Form.Item
                  label='Expiration Date'
                  name='expirationDate'
                  rules={[
                    {
                      type: 'date',
                      message: 'Please input correct Date!',
                    },
                  ]}
                >
                  <DatePicker
                    size='large'
                    className='ant-input ant-input-lg custom-input'
                    picker='date'
                    format={'MM/DD/YYYY'}
                    onChange={toggleExpirationDate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Reminder Date'
                  name='reminderDate'
                  rules={[
                    {
                      type: 'date',
                      message: 'Please input correct Date!',
                    },
                  ]}
                >
                  <DatePicker
                    size='large'
                    className='ant-input ant-input-lg custom-input'
                    picker='date'
                    format={'MM/DD/YYYY'}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[30, 10]} justify='center'>
              <Col span={12}>
                <Form.Item
                  label='Vaccine Status:'
                  name='vaccineStatus'
                >
                  <Badge
                    className='site-badge-count-200'
                    count={expirationDate && (moment(expirationDate).format('MM/DD/YYYY') <= moment().format('MM/DD/YYYY') ? 'Overdue' : 'Current')}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              </Col>
            </Row>
            <Row gutter={[30, 10]} justify='end'>
              <Col>
                <Button
                  type='primary'
                  size='large'
                  style={{ height: '3rem', marginTop: 10 }}
                  htmlType='submit'
                  loading={isEditing ? updateMutation.isLoading : addPetMutation.isLoading}
                >
                  {isEditing ? 'Save Pet Information' : 'Add Pet Information'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default EditPetInformation;

EditPetInformation.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  petDetails: PropTypes.object,
  isEditing: PropTypes.bool.isRequired,
  getPetDetails: PropTypes.func.isRequired,
  getAllPets: PropTypes.func.isRequired,
};
