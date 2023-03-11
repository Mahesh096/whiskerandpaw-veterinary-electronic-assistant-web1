import React, { useContext, useEffect, useState } from 'react';

//Components
import { CustomInput } from 'components/CustomInput';
import { AppStateContext } from 'AppContext';

//third-party libraries
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Table,
} from 'antd';

const { Option } = Select;
import PropTypes from 'prop-types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import moment from 'moment';

//API
import api from 'api';

const PetInformation = ({
  visible,
  onCancel,
  petParentCreated,
  closeAddPet,
}) => {
  const [petFormData] = Form.useForm();
  const [petData, setPetData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [petEdited, setPetEdited] = useState({});
  const { clinics } = useContext(AppStateContext);

  //Get pets
  const { data: getPetData, isLoading: isLoadingPets } = useQuery(
    'petsData',
    () => api.pet.getAllPets(clinics[0].serialId),
  );

  //Add Pet
  const mutation = useMutation((petDetails) => api.pet.addPet(petDetails), {
    onSuccess: () => {
      notification.success({
        message: 'Pet has been successfully created',
        description: `Pet has been successfully created.`,
      });
      petFormData.resetFields();
      onCancel();
      closeAddPet();
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
    (petDetails) => api.pet.editPet(petEdited.id, petDetails),
    {
      onSuccess: () => {
        notification.success({
          message: 'Pet has been successfully updated',
          description: `Pet has been successfully updated.`,
        });
        petFormData.resetFields();
      },
      onError: (error) => {
        notification.error({
          message: 'Pet Add Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  //delete Pet
  const deleteMutate = useMutation((id) => api.pet.deletePet(id), {
    onSuccess: () => {
      notification.success({
        message: 'Pet has been successfully deleted',
        description: `Pet has been successfully deleted.`,
      });
    },
    onError: (error) => {
      notification.error({
        message: 'Pet Delete Error',
        description: `${error.response.data.message}`,
      });
    },
  });

  //Select
  const { data: breedData, isLoading: isLoadingBreed } = useQuery(
    'getBreeds',
    () => api.breeds.getAllBreeds(),
  );
  const { data: colorData, isLoading: isLoadingColor } = useQuery(
    'getColor',
    () => api.colors.getColors(),
  );
  const { data: genderData, isLoading: isLoadingGender } = useQuery(
    'getGender',
    () => api.genders.getAllGenders(),
  );

  useEffect(() => {
    if (!isLoadingPets && getPetData && breedData) {
      const {
        data: { pets },
      } = getPetData;
      const mappedData = pets
        ?.filter((res) => res.parent_id === petParentCreated.id)
        .map((mapped) => {
          return {
            id: mapped.id,
            name: mapped.name,
            breedId: breedData?.data?.breeds?.find(
              (res) => res.breed === mapped.breed,
            ).id,
            dateOfBirth: moment(mapped.date_of_birth, 'YYYY-MM-DD'),
            color: mapped.color,
            gender: mapped.gender,
          };
        });
      setPetData(mappedData);
    }
  }, [getPetData, breedData]);

  const addPet = (values) => {
    if (petParentCreated) {
      values.dateOfBirth = String(
        moment(values.dateOfBirth).format('YYYY-MM-DD'),
      );
    }
    if (petData.length) {
      setPetData([...petData, values]);
    } else {
      setPetData([values]);
    }
    petFormData.resetFields();
  };

  const deletePetData = (value) => {
    if (value.id) {
      deleteMutate.mutate(value.id);
      const index = petData.findIndex((res) => res.name === value.name);
      const data = petData.filter((res, idx) => idx !== index);
      setPetData(data);
    } else {
      const index = petData.findIndex((res) => res.name === value.name);
      const data = petData.filter((res, idx) => idx !== index);
      setPetData(data);
    }
  };

  const editPet = (value) => {
    if (value.id) {
      petFormData.setFieldsValue(value);
      setPetEdited(value);
      setIsEditing(true);
    } else {
      notification.error({
        message: 'Error',
        description: `You should first save the pet`,
      });
    }
  };

  const cancelEdit = () => {
    petFormData.resetFields();
    setIsEditing(false);
  };

  const saveEditPet = () => {
    if (isEditing) {
      const index = petData.findIndex((res) => res.name === petEdited.name);
      const data = [...petData];
      data[index] = { ...petFormData.getFieldsValue(), id: petEdited.id };
      const updateData = {
        name: petFormData.getFieldValue('name'),
        breed_id: petFormData.getFieldValue('breedId'),
        date_of_birth: petFormData.getFieldValue('dateOfBirth'),
      };
      updateMutation.mutate(updateData);
      setPetData(data);
      setPetEdited(null);
    }
    setIsEditing(false);
  };

  const onFinish = (values) => {
    addPet(values);
  };

  const onFinishFailed = (values) => {
    notification.error({
      message: 'Form Field Error',
      description: `${values.errorFields[0].errors[0]}`,
    });
  };

  const onSelectBreed = (e) => {
    petFormData.setFieldsValue({ breedId: e });
  };

  const onSelectColor = (e, val) => {
    petFormData.setFieldsValue({ color: val.children });
  };

  const onSelectGender = (e, val) => {
    petFormData.setFieldsValue({ gender: val.children });
  };

  const handleSubmit = () => {
    if (petData.length) {
      const data = {
        clinicId: clinics[0].serialId,
        parentId: petParentCreated.id,
        petsArr: petData.filter((res) => !res.id),
      };
      if (data.petsArr.length) {
        mutation.mutate(data);
      } else {
        notification.error({
          message: 'Pet Add Error',
          description: `You must add a pet`,
        });
      }
    }
  };

  const columns = [
    {
      title: 'Pet Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Pet Breed',
      dataIndex: 'breedId',
      key: 'breedId',
      render: function Actions(record) {
        return (
          <>
            {breedData?.data?.breeds?.find((res) => res.id === record)?.breed}
          </>
        );
      },
    },
    {
      title: 'Pet Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Pet Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: function Actions(record) {
        return (
          <>
            <Popconfirm
              title="Are you sure to delete this Pet Parent?"
              onConfirm={() => deletePetData(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="dashed"
                icon={<DeleteOutlined />}
                loading={deleteMutate.isLoading}
              />
            </Popconfirm>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => editPet(record)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div id="pet-information">
      <Modal
        title={`Add Pet to ${petParentCreated.first_name}`}
        onCancel={closeAddPet}
        visible={visible}
        width={800}
        style={{ paddingTop: '1rem' }}
        className="custom-modal"
        okText="Add Pet(s)"
        footer={null}
      >
        <div>
          <Divider orientation="left" style={{ fontSize: 18, marginTop: 0 }}>
            Pet Details
          </Divider>
        </div>
        <Form
          layout="vertical"
          name="pet-parent"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={petFormData}
        >
          <Row gutter={[30, 10]} justify="center">
            <Col span={12}>
              <Form.Item
                label="Pet Name"
                name="name"
                rules={[{ required: true }]}
              >
                <CustomInput type="text" size="large" placeholder="Pet Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Pet Breed"
                name="breedId"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  style={{ lineHeight: 3.5 }}
                  className="ant-select ant-select-lg custom-select"
                  loading={isLoadingBreed}
                  placeholder="Select Breed"
                  optionFilterProp="children"
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
          <Row gutter={[30, 10]} justify="center">
            <Col span={12}>
              <Form.Item
                label="Pet Color"
                name="color"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  style={{ lineHeight: 3.5 }}
                  className="ant-select ant-select-lg custom-select"
                  size="large"
                  loading={isLoadingColor}
                  disabled={isEditing}
                  placeholder="Select Color"
                  optionFilterProp="children"
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
                label="Pet Gender"
                name="gender"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  style={{ lineHeight: 3.5 }}
                  className="ant-select ant-select-lg custom-select"
                  size="large"
                  loading={isLoadingGender}
                  placeholder="Select Gender"
                  disabled={isEditing}
                  optionFilterProp="children"
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
          <Row gutter={[30, 10]} justify="center">
            <Col span={12}>
              <Form.Item
                label="Date Of Birth"
                name="dateOfBirth"
                rules={[
                  {
                    type: 'date',
                    message: 'Please input correct Date!',
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  className="ant-input ant-input-lg custom-input"
                  picker="date"
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row gutter={[30, 10]} justify="left">
            <Col span={5}>
              <Button
                type="default"
                justify="left"
                size="large"
                style={{ width: '8rem', height: '3rem' }}
                htmlType="submit"
                disabled={isEditing}
              >
                Add Pet
              </Button>
            </Col>
            {isEditing ? (
              <Col span={5}>
                <Button
                  type="default"
                  justify="left"
                  size="large"
                  style={{ width: '8rem', height: '3rem' }}
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
              </Col>
            ) : null}
            {isEditing ? (
              <Col span={5}>
                <Button
                  type="primary"
                  justify="left"
                  size="large"
                  style={{ width: '8rem', height: '3rem' }}
                  onClick={saveEditPet}
                >
                  Save
                </Button>
              </Col>
            ) : null}
          </Row>
          <div>
            <Table
              dataSource={petData}
              columns={columns}
              style={{ marginTop: 10 }}
            />
          </div>
        </Form>
        <Row gutter={[30, 10]} justify="end">
          <Col>
            <Button
              type="primary"
              size="large"
              style={{ width: '8rem', height: '3rem', marginTop: 10 }}
              onClick={handleSubmit}
              loading={mutation.isLoading}
            >
              Save Pet(s)
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default PetInformation;

PetInformation.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  petParentCreated: PropTypes.object,
  closeAddPet: PropTypes.func,
};
