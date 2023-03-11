import React from 'react';

//third-party library
import PropTypes from 'prop-types';
import moment from 'moment';
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
};

import LogoClinic from 'imgs/app-logo.svg';
import CustomTable from './FinalSummaryPDF/_Partials/CustomTablePDF';

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.page,
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
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
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  title2: {
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
    fontSize: 12,
    marginTop: 10,
    borderSpacing: 0,
    borderCollapse: 'collapse',
  },
  tableHeader: {
    display: 'table-row',
    fontWeight: 'bold',
    textAlign: 'center',
    flexDirection: 'row',
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
    width: '100%',
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
});
const TreatmentPDF = ({
  signURL,
  petDetails,
  petParent,
  clinicInfo,
  treatmentData,
  medicationTableData,
}) => {
  const handleMedications = [...medicationTableData]?.map((med) => {
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

  const handleTreatments = [...treatmentData]?.map((treatment) => {
    return {
      'Description ': treatment?.name,
      Quantity: 1,
      Cost: Number(treatment?.cost).toFixed(2),
      // 'Taxes': +treatment?.tax,
      'Total Charges': Number(treatment?.cost).toFixed(2),
      'Total Payment': Number(treatment?.cost).toFixed(2),
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

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.columnCenter, styles.header]}>
          <Image src={clinicInfo?.avatar || LogoClinic} style={styles.logo} />
          <Text style={styles.rowCenter}>{clinicInfo?.clinic_name}</Text>
        </View>

        <View style={styles.clinicAddress}>
          <Text>Clinic Name: {clinicInfo?.clinic_name}</Text>
          <Text>{clinicInfo?.address?.line1}</Text>
          <Text>
            {clinicInfo?.address?.city}, {clinicInfo?.address?.state},{' '}
            {clinicInfo?.address?.zip}
          </Text>
          <Text>Phone Number: {clinicInfo?.contact_phone_number}</Text>
          <Text>{clinicInfo?.contact_email}</Text>
        </View>

        <View style={styles.rowCenter}>
          <Text style={styles.title}>Procedure Treatment Plan</Text>
        </View>

        <View style={styles.rowEnd}>
          <Text style={styles.todayDate}>{moment().format('MM/DD/YYYY')}</Text>
        </View>

        <View style={styles.clinicAddress}>
          <Text>Pet Name: {petDetails?.name}</Text>
          <Text style={{ marginTop: 15 }}>
            {petParent?.first_name} {petParent?.last_name}
          </Text>
          <Text>{petParent?.data?.petParent?.address.addressLine1}</Text>
          <Text>{petParent?.data?.petParent?.address.addressLine2}</Text>
          <Text>
            {petParent?.data?.petParent?.address.city}{' '}
            {petParent?.data?.petParent?.address.state}{' '}
            {petParent?.data?.petParent?.address.zip}
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text>
            This document lists procedures to be performed on {petDetails?.name}
            . This treatment plan only approximates the cost of this visit. It
            does not include any treatments that may be deemed necessary upon
            examination and commencement of the included treatments. You are
            responsible for all fees incurred during this visit included or not
            on this treatment plan.
          </Text>
          <Text style={{ marginTop: 10 }}>
            The following is a list of the treatments, medications and/or
            supplies expected to be required during this visit and their
            approximate cost.
          </Text>
          <Text style={{ marginTop: 10 }}>
            If you have any questions concerning this treatment plan please do
            not hesitate to ask.
          </Text>
        </View>

        <View>
          <View
            style={[
              styles.rowSpace,
              styles.title2,
              { marginTop: 15, marginBottom: 5 },
            ]}
          >
            <Text>List of Proposed Treatment and Medications</Text>
            <Text>{moment().format('MM/DD/YYYY')}</Text>
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

        <View style={styles.paragraph}>
          <Text>
            Be assured that the health of {petDetails?.name} is our highest
            concern and we will do everything possible to maintain that health.
            Understand too, that your signature below indicates that you have
            reviewed and agree to the terms of this treatment plan.
          </Text>
          <Text style={{ marginTop: 10 }}>
            Your signature below does not make you responsible for the charges
            listed above unless performed upon “Pet’s name”.
          </Text>
          <Text style={{ marginTop: 10 }}>
            I accept and agree to the terms of this treatment plan:
          </Text>
        </View>

        <View style={[styles.rowSpace, { fontSize: 11, marginTop: 40 }]}>
          <View style={styles.rowSpaceEvenly}>
            <Text>Signature:</Text>
            {signURL && <Image src={signURL} style={styles.signURL} />}
          </View>
          <Text>{moment().format('MMMM Do YYYY')}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TreatmentPDF;

TreatmentPDF.propTypes = {
  signURL: PropTypes.string.isRequired,
  petDetails: PropTypes.object.isRequired,
  petParent: PropTypes.object.isRequired,
  clinicInfo: PropTypes.object.isRequired,
  treatmentData: PropTypes.array.isRequired,
  medicationTableData: PropTypes.array,
};
