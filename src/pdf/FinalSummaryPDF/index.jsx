import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

import {
  View,
  Text,
  Document,
  Page,
  Font,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

Font.registerHyphenationCallback((word) => {
  // Return entire word as unique part
  return [word];
});

const colors = {
  page: '#ffffff',
  blue: '#0b5394',
  tableHeader: '#073763',
};

import LogoClinic from 'imgs/LogoClinic.jpg';
import { PhysicalExamList } from './_Partials/PhysicalExamList';
import CustomTable from './_Partials/CustomTablePDF';
import formatPhoneNumber from 'utils/formatPhoneNumber';

//import CustomTablePDF from './FinalSummaryPDF/CustomTablePDF';

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.page,
    padding: 30,
  },
  logo: {
    width: 200,
    height: 200,
    margin: 15,
  },
  header: {
    fontFamily: 'Helvetica-Bold',
    padding: 12,
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowEnd: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  columnCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicAddress: {
    fontSize: 10,
  },
  contactInfo: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
  },
  subTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  todayDate: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginRight: 20,
    marginTop: 20,
  },
  paragraph: {
    marginTop: 15,
    fontSize: 10,
    textAlign: 'justify',
  },
  rowSpace: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table: {
    display: 'table',
    fontSize: 10,
    marginTop: 10,
    borderSpacing: 0,
  },
  tableHeader: {
    display: 'table-row',
    fontWeight: 'bold',
    textAlign: 'center',
    flexDirection: 'row',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  row: {
    display: 'table-row',
    flexDirection: 'row',
    borderSpacing: 0,
  },
  cell: {
    display: 'table-cell',
    border: 'solid',
    borderWidth: 1,
    width: '30%',
    padding: 2,
  },
  signURL: {
    width: 70,
    height: 60,
    padding: 0,
  },
  rowSpaceEvenly: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  signURLSection: {
    marginTop: 20,
  },
  list: {
    fontSize: 12,
  },
  subList: {
    fontSize: 10,
  },
});

const FinalSummaryPDF = ({
  petDetails,
  petParentData,
  clinicExamination,
  diagnosis,
  subjectiveData,
  handleClinicData,
  treatments,
  medications,
}) => {
  const handleDiagnosis = diagnosis?.map((diag) => {
    return {
      diagnosis: diag?.name,
      'diagnosis description': diag?.description,
      'common symptoms': diag?.symptoms,
    };
  });

  const handleTreatments = [...treatments]?.map((treatment) => {
    return {
      'Description ': treatment?.name,
      Quantity: 1,
      Cost: Number(treatment?.cost).toFixed(2),
      // 'Taxes': +treatment?.tax,
      'Total Charges': Number(treatment?.cost).toFixed(2),
      'Total Payment': Number(treatment?.cost).toFixed(2),
    };
  });

  const handleTreatmentResult = [...treatments]?.map((treatment) => {
    return {
      'Type ': treatment?.category,
      'Tx Name': treatment?.name,
      'Tx Description': treatment?.description,
      Results: `${
        treatment?.testResult?.current_result?.result_name || 'N/A'
      }; ${treatment?.testResult?.current_result?.reason || ''}`,
      'Additional Note': treatment?.testResult?.additionalNotes || 'N/A',
    };
  });

  const handleCarePlan = [...medications]?.map((med) => {
    return {
      'Product Name': med?.product_name,
      Volume: `${
        Number(
          med?.current_price_details?.volume || med?.price_details[0]?.volume,
        ) || 1
      } ${
        med?.current_price_details?.volume_unit ||
        med?.price_details[0]?.volume_unit
      }`,
      Measure: med?.measure,
      QTY:
        med?.current_price_details?.quantity ||
        med?.price_details[0]?.quantity ||
        1,
      'Dose Instructions': med?.dose_instructions,
      Symptoms: med?.symptoms,
    };
  });

  const handleMedications = [...medications]?.map((med) => {
    return {
      'Description ': med?.product_name,
      Quantity:
        med?.current_price_details?.quantity ||
        med?.price_details[0]?.quantity ||
        1,
      Cost: Number(
        med?.current_price_details?.client_price_per_unit ||
          med?.price_details[0]?.client_price_per_unit ||
          0,
      ).toFixed(2),
      // 'Taxes': +med?.tax,
      'Total Charges': Number(
        med?.current_price_details?.client_price_per_unit ||
          med?.price_details[0]?.client_price_per_unit ||
          0,
      ).toFixed(2),
      'Total Payment': Number(
        med?.current_price_details?.client_price_per_unit ||
          med?.price_details[0]?.client_price_per_unit ||
          0,
      ).toFixed(2),
    };
  });

  const handleTreatmentsData = (data) => {
    const total = data.reduce((actual, data) => actual + Number(data.Cost), 0);
    const newData = [...data];
    newData.push({
      Type: 'Total',
      'Description ': '',
      Quantity: '',
      Cost: '',
      // 'Taxes': +treatment?.tax,
      'Total Charges': '',
      'Total Payment': Number(total).toFixed(2),
    });
    return newData;
  };

  const getRandomId = (min = 0, max = 5000000) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num.toString().padStart(6, '0');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.columnCenter, styles.header]}>
          <Image
            src={
              handleClinicData?.avatar ? handleClinicData?.avatar : LogoClinic
            }
            style={styles.logo}
          />
          <Text
            style={styles.rowCenter}
          >{`${handleClinicData?.clinic_name}`}</Text>
        </View>

        <View style={styles.contactInfo}>
          <Text>
            Veterinarian on Staff: {`${handleClinicData?.clinic_name}`}
          </Text>
          <Text>
            {' '}
            Call us:{' '}
            {`${formatPhoneNumber(handleClinicData?.contact_phone_number)}`}
          </Text>
          <Text>Email us: {`${handleClinicData?.contact_email}`}</Text>
          <Text>
            Website: {`https://www.veterinarianelectronicassistant.com/`}
          </Text>
        </View>

        <View style={styles.rowCenter}>
          <Text style={styles.title}>Combined </Text>
        </View>
        <View style={styles.rowCenter}>
          <Text style={styles.title}>Final Visit Summary & Invoice</Text>
        </View>

        <View style={styles.rowEnd}>
          <Text style={styles.todayDate}>{moment().format('MM/DD/YYYY')}</Text>
        </View>

        <View style={styles.clinicAddress}>
          <Text>Pet Name: {petDetails?.name}</Text>
          <Text
            style={{ marginTop: 15 }}
          >{`${petParentData?.first_name} ${petParentData?.last_name}`}</Text>
          <Text>{`${petParentData?.address.addressLine1}`}</Text>
          <Text>{`${petParentData?.address.addressLine2}`}</Text>
          <Text>{`${petParentData?.address.city}, ${petParentData?.address.state}, ${petParentData?.address.zip}`}</Text>
        </View>

        <View style={[styles.table, { marginTop: 10 }]}>
          <View style={styles.tableHeader}>
            <Text
              style={[styles.cell, { width: '100%' }]}
            >{`Doctor’s name: ${handleClinicData?.contact_name}`}</Text>
            <Text style={[styles.cell, { width: '100%' }]}>
              {getRandomId()}
            </Text>
          </View>
        </View>

        <View>
          <View
            style={[
              styles.rowSpace,
              styles.title,
              { marginTop: 15, color: colors.blue },
            ]}
          >
            <View>
              <Text>Final Charges Summary </Text>
            </View>
          </View>
        </View>
        {handleTreatments && (
          <CustomTable
            dimensions={[25, 25, 25, 25, 25]}
            data={handleTreatmentsData([
              ...handleTreatments.map((trt) => ({
                Type: 'Procedure/Treatment',
                ...trt,
              })),
              ...handleMedications.map((med) => ({
                Type: 'Medication ',
                ...med,
              })),
            ])}
          />
        )}
      </Page>

      <Page size="A4" style={styles.page} wrap>
        <Text style={[styles.title, { color: colors.blue }]}>
          {`${petDetails?.name}`} Visit Summary
        </Text>
        <Text style={[styles.subTitle, { marginTop: 5 }]}>
          {`${petDetails?.name}`} was seen today for{' '}
          {`${subjectiveData?.cheifComplaint?.duration}`}{' '}
          {`${subjectiveData?.reasonsForConsultation}`}, based on the following
          complaints: {`${subjectiveData?.cheifComplaint?.complaint}`}.
        </Text>

        <Text style={[styles.subTitle, { marginTop: 15 }]}>
          We have concluded that {`${petDetails?.name}`} has the following based
          on the test results we conducted:
        </Text>

        <View style={{ marginTop: 10 }}>
          {handleDiagnosis && (
            <CustomTable dimensions={[25, 50, 50, 0]} data={handleDiagnosis} />
          )}
        </View>

        <Text style={[styles.subTitle, { marginTop: 10 }]}>Test Results</Text>

        <View style={{ marginTop: 10 }}>
          <CustomTable
            dimensions={[25, 25, 25, 25, 25]}
            data={handleTreatmentResult}
          />
        </View>

        <Text style={[styles.paragraph, { marginTop: 15 }]}>
          We know that it’s not always fun for {`${petDetails?.name}`} to visit
          us at the clinic no matter how excited we are to see{' '}
          {`${
            petDetails?.gender.toUpperCase().includes('FEMALE') ? 'her' : 'him'
          }`}
          . Because of that, we made sure to give extra hugs, kisses, and treats
          to make{' '}
          {`${
            petDetails?.gender.toUpperCase().includes('FEMALE') ? 'her' : 'his'
          }`}{' '}
          visit more comfortable. {`${petDetails?.name}`} did very well today
          and we formulated some special recommendations for home.
        </Text>

        <Text style={[styles.title, { color: colors.blue, marginTop: 20 }]}>
          Care Plan
        </Text>
        <Text style={[styles.paragraph]}>
          Based on today’s exam and the final diagnosis, we’d like to get{' '}
          {`${petDetails?.name}`} on the following care plan:{' '}
        </Text>

        <View style={{ marginTop: 10 }}>
          <CustomTable
            dimensions={[25, 25, 25, 25, 50, 50]}
            data={handleCarePlan}
          />
        </View>

        <Text style={[styles.title, { color: colors.blue, marginTop: 25 }]}>
          Additional Care Recommendations
        </Text>
        <Text style={[styles.paragraph]}>
          {subjectiveData?.additionalCareText || 'N/A'}
        </Text>
      </Page>

      <Page size="A4" style={styles.page} wrap>
        <Text style={[styles.title, { color: colors.blue, marginTop: 20 }]}>
          Reminders
        </Text>
        <Text style={[styles.paragraph, { marginTop: 5 }]}>{`${
          subjectiveData?.additionalNotes?.reminders ||
          'No Reminders for this or future visits.'
        }`}</Text>

        <Text style={[styles.title, { color: colors.blue, marginTop: 30 }]}>
          Full Exam Summary
        </Text>
        <Text style={[styles.paragraph, { marginTop: 5 }]}>
          We have noted the following for {`${petDetails?.name}`}
        </Text>

        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`${petDetails?.name}`}{' '}
          {`${subjectiveData?.additionalNotes?.travel ? 'has' : 'has not'}`}{' '}
          traveled outside of the country.
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`${petDetails?.name}`}{' '}
          {`${subjectiveData?.additionalNotes?.coughing ? 'is' : 'is not'}`}{' '}
          coughing.
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`${petDetails?.name}`}{' '}
          {`${subjectiveData?.additionalNotes?.sneezing ? 'is' : 'is not'}`}{' '}
          sneezing
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`${petDetails?.name}`}{' '}
          {`${subjectiveData?.additionalNotes?.vomiting ? 'is' : 'is not'}`}{' '}
          vomiting.
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`${petDetails?.name}`}{' '}
          {`${subjectiveData?.additionalNotes?.diarrhea ? 'does' : 'does not'}`}{' '}
          have diarrhea.
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`${petDetails?.name}`} has{' '}
          {`${
            subjectiveData?.additionalNotes?.water_intake
              ? 'normal'
              : 'abnormal'
          }`}{' '}
          water intake.
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`${petDetails?.name}`} has the following special diets:{' '}
          {`${subjectiveData?.additionalNotes?.special_diets}`}
        </Text>

        <Text style={[styles.paragraph, { marginTop: 10 }]}>
          All vitals were captured and a physical exam was conducted to further
          evaluate {`${petDetails?.name}`}.{' '}
        </Text>

        <Text style={[styles.title, { color: colors.blue, marginTop: 30 }]}>
          Vitals
        </Text>
        <Text style={[styles.paragraph, { marginTop: 10 }]}>
          {`Temp: `}
          {`${subjectiveData.petVitalsData.temperature}`}
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`Respiratory Rate: `}
          {`${subjectiveData.petVitalsData.respiratory_rate}`}
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`Heart Rate: `} {`${subjectiveData.petVitalsData.heart_rate}`}
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`Weight: `}
          {`${subjectiveData.petVitalsData.weight}`}
        </Text>
        <Text style={[styles.paragraph, { marginTop: 0 }]}>
          {`Body Score: `}
          {`${
            clinicExamination.body_score?.includes('undefined')
              ? 'not recorded during visit'
              : clinicExamination.body_score
          }`}
        </Text>

        <Text style={[styles.title, { color: colors.blue, marginTop: 30 }]}>
          Physical Exam
        </Text>

        {clinicExamination?.examinations?.map((exam, key) => {
          return (
            <PhysicalExamList
              key={key}
              name={exam.name}
              issues={exam.issues || 'N/A'}
              comments={exam.comment}
            />
          );
        })}
      </Page>
    </Document>
  );
};

export default FinalSummaryPDF;

FinalSummaryPDF.propTypes = {
  petDetails: PropTypes.object,
  petParentData: PropTypes.object,
  clinicExamination: PropTypes.object,
  subjectiveData: PropTypes.object,
  diagnosis: PropTypes.array,
  handleClinicData: PropTypes.object,
  treatments: PropTypes.array,
  medications: PropTypes.array,
};
