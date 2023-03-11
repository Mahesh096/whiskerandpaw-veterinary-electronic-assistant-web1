import React, { useContext, useEffect, useState } from 'react';

//components
import ClientInformationDetails from './_partials/ClientInformationDetails';
import { AppStateContext } from 'AppContext';

//Api
import api from 'api';

//third-party libraries
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { Button, Col, Form, Modal, notification, Row } from 'antd';
import PetInformation from './_partials/PetInformation';
import moment from 'moment';

const CreateClientInformation = ({
  visible,
  onCancel,
  isCreate,
  petParentData,
  refetch,
}) => {
  const [createPetParentsForm] = Form.useForm();
  const { clinics } = useContext(AppStateContext);
  const [showAddPet, setShowAddPet] = useState(false);
  const [processAddPet, setProcessAddPet] = useState(false);
  const [petParentCreated, setPetParentCreated] = useState({});
  const formatDate = 'YYYY-MM-DD';

  //Update pet parents
  const mutationUpdate = useMutation(
    (petParentsDetails) =>
      api.petParents.editPetParent(petParentData?.id, petParentsDetails),
    {
      onSuccess: () => {
        notification.success({
          message: 'Pet parents has been successfully created',
          description: `Pet parents has been successfully created.`,
        });
        refetch();
        onCancel();
      },
      onError: (error) => {
        notification.error({
          message: 'Pet parents Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  //Add new pet parents
  const mutationCreate = useMutation(
    (petParentsDetails) => api.petParents.addPetParent(petParentsDetails),
    {
      onSuccess: ({ data }) => {
        notification.success({
          message: 'Pet parents has been successfully created',
          description: `Pet parents has been successfully created.`,
        });

        if (processAddPet) {
          setPetParentCreated(data.petParent);
          setShowAddPet(true);
          refetch();
        } else {
          refetch();
          onCancel();
        }
      },
      onError: (error) => {
        notification.error({
          message: 'Pet parents Error',
          description: `${error.response.data.message}`,
        });
      },
    },
  );

  useEffect(() => {
    if (!isCreate && petParentData) {
      const mappedData = {
        first_name: petParentData.first_name,
        last_name: petParentData.last_name,
        email: petParentData.email,
        date_of_birth: moment(petParentData.date_of_birth, formatDate),
        phone_number: petParentData.phone_number,
        addressLine1: petParentData.address.addressLine1,
        addressLine2: petParentData.address.addressLine2,
        city: petParentData.address.city,
        state: petParentData.address.state,
        zip: petParentData.address.zip,
        erFirstName: petParentData.emergency_contact.erFirstName,
        erLastName: petParentData.emergency_contact.erLastName,
        // fullName: petParentData.emergency_contact.fullName,
        emergencyPhoneNumber: petParentData.emergency_contact.phoneNumber,
        id: petParentData.id,
      };
      createPetParentsForm.setFieldsValue(mappedData);
    }
  }, []);

  const handleAddressSelect = (e) => {
    createPetParentsForm.setFieldsValue({ addressLine1: e });
  };

  const toogleShowAddPet = () => {
    setProcessAddPet(true);
    if (!isCreate) {
      setShowAddPet(!showAddPet);
    } else {
      createPetParentsForm.submit();
    }
  };

  const closeAddPet = () => {
    setShowAddPet(false);
    setProcessAddPet(false);
  };

  const onFinish = (val) => {
    if (isCreate) {
      const newData = {
        firstName: val.first_name,
        lastName: val.last_name,
        email: val.email,
        dateOfBirth: moment(val.date_of_birth, formatDate),
        phoneNumber: val.phone_number,
        address: {
          addressLine1: val.addressLine1,
          addressLine2: val.addressLine2,
          city: val.city,
          state: val.state,
          zip: val.zip,
        },
        emergencyContact: {
          erFirstName: val.erFirstName,
          erLastName: val.erLastName,
          // fullName: val.fullName,
          phoneNumber: val.emergencyPhoneNumber,
        },
        clinicId: clinics[0].serialId,
      };
      if (!petParentCreated.id) {
        mutationCreate.mutate(newData);
      } else {
        notification.error({
          message: 'Error Add Pet Parent',
          description: `This pet parent is already exist`,
        });
      }
    } else {
      const updateData = {
        first_name: val.first_name,
        last_name: val.last_name,
        email: val.email,
        date_of_birth: moment(val.date_of_birth, formatDate),
        phone_number: val.phone_number,
        address: {
          addressLine1: val.addressLine1,
          addressLine2: val.addressLine2,
          city: val.city,
          state: val.state,
          zip: val.zip,
        },
        emergency_contact: {
          erFirstName: val.erFirstName,
          erLastName: val.erLastName,
          // fullName: val.fullName,
          phoneNumber: val.emergencyPhoneNumber,
        },
        clinic_id: clinics[0].serialId,
      };
      mutationUpdate.mutate(updateData);
    }
  };

  const onFinishFailed = (val) => {
    notification.error({
      message: 'Form Field Error',
      description: `${val.errorFields[0].errors[0]}`,
    });
  };

  return (
    <div id="update-client-information">
      <Modal
        title={isCreate ? 'Add Pet Parent' : 'Update Pet Parents'}
        onCancel={onCancel}
        visible={visible}
        width={800}
        className="custom-modal"
        okText="Update Client"
        footer={null}
      >
        <Form
          layout="vertical"
          name="pet-parent"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={createPetParentsForm}
        >
          <div id="client-information">
            <div>
              <ClientInformationDetails
                handleAddressSelect={handleAddressSelect}
              />
            </div>
            <Row justify="end">
              <Col span={8}>
                <Button
                  size="medium"
                  type="primary"
                  className="custom-button"
                  style={{
                    marginTop: 10,
                    height: 46,
                    fontSize: 15,
                    width: '95%',
                  }}
                  loading={
                    processAddPet
                      ? false
                      : isCreate
                      ? mutationCreate.isLoading
                      : mutationUpdate.isLoading
                  }
                  htmlType="submit"
                >
                  {!isCreate ? 'Save' : 'Save and Continue Later'}
                </Button>
              </Col>
              {isCreate ? (
                <Col span={8}>
                  <Button
                    size="medium"
                    type="primary"
                    className="custom-button"
                    loading={
                      !processAddPet
                        ? false
                        : isCreate
                        ? mutationCreate.isLoading
                        : mutationUpdate.isLoading
                    }
                    style={{
                      marginTop: 10,
                      height: 45,
                      fontSize: 15,
                      width: '95%',
                    }}
                    onClick={toogleShowAddPet}
                  >
                    Save and Proceed to Add Pet
                  </Button>
                </Col>
              ) : (
                <Col span={8}>
                  <Button
                    size="medium"
                    type="primary"
                    className="custom-button"
                    loading={
                      !processAddPet
                        ? false
                        : isCreate
                        ? mutationCreate.isLoading
                        : mutationUpdate.isLoading
                    }
                    style={{
                      marginTop: 10,
                      height: 45,
                      fontSize: 15,
                      width: '95%',
                    }}
                    onClick={toogleShowAddPet}
                  >
                    Edit Pets
                  </Button>
                </Col>
              )}
              {!isCreate ? (
                <Col span={8}>
                  <Button
                    size="medium"
                    type="default"
                    className="custom-button "
                    style={{
                      marginTop: 10,
                      height: 45,
                      fontSize: 15,
                      width: '95%',
                    }}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </Col>
              ) : null}
            </Row>
            <PetInformation
              onCancel={onCancel}
              visible={showAddPet}
              petParentCreated={isCreate ? petParentCreated : petParentData}
              closeAddPet={closeAddPet}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateClientInformation;

CreateClientInformation.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCreate: PropTypes.bool.isRequired,
  petParentData: PropTypes.object,
  refetch: PropTypes.func,
};
