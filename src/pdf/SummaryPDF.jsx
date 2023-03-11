import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';

import ClinicLogo from 'imgs/LogoClinic.jpg';
import PropTypes from 'prop-types';
import moment from 'moment';

Font.registerHyphenationCallback((word) => {
  // Return entire word as unique part
  return [word];
});

const colors = {
  contactDetailsColor: '#def4f7',
  procedures: '#f0f1f1',
  notes: '#fceef5',
  title: '#82d5e2',
  header: '#eef9fb',
  page: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.page,
    fontSize: 10,
    paddingBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTitle: {
    color: colors.title,
    marginTop: 25,
  },
  titleDetails: {
    flexDirection: 'column',
  },
  addressHeader: {
    width: 200,
    height: 40,
    marginLeft: 10,
    marginTop: 5,
    fontSize: 8,
  },
  clinicDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.header,
    height: 100,
    padding: 20,
  },
  date: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontSize: 24,
    marginTop: 25,
  },
  title: { color: colors.title, fontFamily: 'Helvetica-Bold' },
  subTitle: { fontFamily: 'Helvetica-Bold' },
  body: { display: 'flex', flexDirection: 'column', paddingTop: 25 },
  bodyRow: { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
  card: {
    backgroundColor: colors.contactDetailsColor,
    borderRadius: 7,
    fontSize: 13,
    padding: 7,
    margin: 10,
  },
  columnNameContact: {
    width: 80,
    alignItems: 'center',
    textAlign: 'start',
    margin: 5,
  },
  columnName: { width: 120, alignItems: 'center', textAlign: 'start' },
  columnBody: { width: 380, margin: 5, marginLeft: 15 },
  comments: {
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    paddingTop: 20,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const SummaryPDF = ({ petDetails, petParentData, clinicExamination }) => {
  /*const onRender = (value) => {
        if (value.blob) {
            const formData = new FormData();
            formData.append('PDF-File', value.blob);
        }
    }*/

  return (
    <Document /*onRender={onRender}*/>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.reportHeader}>
          <View style={styles.clinicDetails}>
            <Image src={ClinicLogo} style={styles.logo} />
            <View style={styles.titleDetails}>
              <Text style={styles.logoTitle}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>PetCare</Text>{' '}
                Hospital Center
              </Text>
              <Text style={styles.addressHeader}>
                {`{Physical Address Line 1}, {Physical Address Line 2}
                                {City}, {State}, {Zip}
                                {Phone number}, {Email address}`}
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.date}>{moment().format('DD-MM-YYYY')}</Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Anesthetic/Surgery</Text>
          <Text style={styles.subTitle}>Discharge Summary</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.bodyRow} wrap={false}>
            <View>
              <Text style={styles.columnNameContact}>Pet Name</Text>
            </View>
            <View>
              <Text style={styles.columnBody}>{petDetails?.name}</Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View>
              <Text style={styles.columnNameContact}>Client Name</Text>
            </View>
            <View>
              <Text
                style={styles.columnBody}
              >{`${petParentData?.data.petParent.first_name} ${petParentData?.data.petParent.last_name}`}</Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View>
              <Text style={styles.columnNameContact}>
                Client Billing Address Line
              </Text>
            </View>
            <View>
              <Text
                style={styles.columnBody}
              >{`${petParentData?.data.petParent.address.addressLine1}`}</Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View>
              <Text style={styles.columnNameContact}>
                Client Billing Address Line
              </Text>
            </View>
            <View>
              <Text
                style={styles.columnBody}
              >{`${petParentData?.data.petParent.address.addressLine2}`}</Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View>
              <Text style={styles.columnNameContact}>City</Text>
            </View>
            <View>
              <Text
                style={styles.columnBody}
              >{`${petParentData?.data.petParent.address.city}`}</Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View>
              <Text style={styles.columnNameContact}>State</Text>
            </View>
            <View>
              <Text
                style={styles.columnBody}
              >{`${petParentData?.data.petParent.address.state}`}</Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View>
              <Text style={styles.columnNameContact}>Zip</Text>
            </View>
            <View>
              <Text
                style={styles.columnBody}
              >{`${petParentData?.data.petParent.address.zip}`}</Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View style={[styles.card, { backgroundColor: colors.procedures }]}>
              <Text style={styles.columnName}>Procedures</Text>
            </View>
            <View style={[styles.card, { backgroundColor: colors.procedures }]}>
              <Text style={styles.columnBody}>
                {clinicExamination.map((res) => {
                  if (res.status && res.issues !== '')
                    return `
                                            Examination: ${res.name}
                                            Issues: ${res.issues}
                                            Comment: ${res.comment} 
                                          `;
                })}
              </Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View style={[styles.card, { backgroundColor: colors.notes }]}>
              <Text style={styles.columnName}>Case Notes:</Text>
            </View>
            <View style={[styles.card, { backgroundColor: colors.notes }]}>
              <Text style={styles.columnBody}>
                Your pet has been through a surgical procedure and will need
                special attention for a full uneventful recovery. Keep your pet
                in a small confined space, leash walks for eliminations only
                until the sutures are removed.
              </Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View style={[styles.card, { backgroundColor: colors.procedures }]}>
              <Text style={styles.columnName}>Daily incision monitoring:</Text>
            </View>
            <View style={[styles.card, { backgroundColor: colors.procedures }]}>
              <Text style={styles.columnBody}>
                Check the suture site daily until the sutures are removed. Some
                redness and a little bruising are normal consequences of surgery
                and healing. If the incision becomes painful, opens, or
                discharges pus or blood, please call the clinic for a post-op
                check. DO NOT allow your pet to lick, chew, rub or pull at the
                incision. If this does occur, you should stop the behavior right
                away and begin using an E-collar or improvise a T-shirt to
                ensure proper healing. Follow recommendations from your
                veterinarian.
              </Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View style={[styles.card, { backgroundColor: colors.notes }]}>
              <Text style={styles.columnName}>Case Notes:</Text>
            </View>
            <View style={[styles.card, { backgroundColor: colors.notes }]}>
              <Text style={styles.columnBody}>
                Your pet has been through a surgical procedure and will need
                special attention for a full uneventful recovery. Keep your pet
                in a small confined space, leash walks for eliminations only
                until the sutures are removed.
              </Text>
            </View>
          </View>

          <View style={styles.bodyRow} wrap={false}>
            <View style={[styles.card, { backgroundColor: colors.notes }]}>
              <Text style={styles.columnName}>Case Notes:</Text>
            </View>
            <View style={[styles.card, { backgroundColor: colors.notes }]}>
              <Text style={styles.columnBody}>
                Your pet has been through a surgical procedure and will need
                special attention for a full uneventful recovery. Keep your pet
                in a small confined space, leash walks for eliminations only
                until the sutures are removed.
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.bodyRow, styles.comments]}>
          If you have any questions or concerns do not hesitate to call us.
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default SummaryPDF;

SummaryPDF.propTypes = {
  petDetails: PropTypes.object.isRequired,
  petParentData: PropTypes.object.isRequired,
  clinicExamination: PropTypes.array.isRequired,
};
