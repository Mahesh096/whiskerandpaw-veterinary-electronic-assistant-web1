import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Canvas,
} from '@react-pdf/renderer';

import ClinicLogo from 'imgs/LogoClinic2.jpg';

Font.registerHyphenationCallback((word) => {
  // Return entire word as unique part
  return [word];
});

const colors = {
  contactDetailsColor: '#def4f7',
  procedures: '#f0f1f1',
  notes: '#fceef5',
  title: '#000000',
  header: '#ffffff',
  page: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.page,
    fontSize: 10,
    padding: 30,
  },
  logo: {
    width: 100,
    height: 90,
  },
  reportHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.header,
    height: 100,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: colors.title, fontFamily: 'Helvetica-Bold', fontSize: 10 },
  subTitle: {
    fontSize: 8,
    width: 120,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 3,
  },
  subHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  body: { display: 'flex', flexDirection: 'column', paddingTop: 25 },
  table: {
    display: 'flex',
    flexDirection: 'column',
  },
  rowTable1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 3,
    marginBottom: 3,
    fontSize: 8,
  },
  rowTable2: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10,
    textAlign: 'center',
    margin: 2,
  },
  tableColumn: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
  },
  subTotalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 22,
    marginTop: 5,
  },
  subTotal: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  reminderContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  reminder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  reminderText: {
    margin: 2,
    marginLeft: 10,
  },
  totalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  totalColumn: {
    display: 'flex',
    flexDirection: 'row',
    // paddingRight: 20
  },
  columnHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    textAlign: 'right',
    width: 150,
    marginTop: 4,
  },
  columnValue: {
    width: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginTop: 4,
    marginRight: 20,
  },

  numberPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
  },
  pageNumber: {
    fontSize: 10,
  },
  footer: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    padding: 45,
  },
});

const DocPDF2 = () => {
  /*const onRender = (value) => {
        if (value.blob) {
            const formData = new FormData();
            formData.append('PDF-File', value.blob);
            console.log(formData.get('PDF-File'));
        }
    }*/

  return (
    <Document /*onRender={onRender}*/>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.reportHeader}>
          <View>
            <Image src={ClinicLogo} style={styles.logo} />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Rocky Gorge Animal Hospital</Text>
            <Text style={styles.subTitle}>{`7515 Brooklyn Bridge Road
                            Laurel, MD 20707
                            (301)776-7744`}</Text>
          </View>

          <View style={styles.numberPageContainer}>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} / ${totalPages}`
              }
              fixed
            />
          </View>
        </View>

        <View style={styles.subHeader}>
          <View>
            <Text>Patricia Porter</Text>
            <Text>8657 Willow Terrace Santee, CA 92071</Text>
            <Text>(213) 238-8241</Text>
            <Text>patricia.porter86@gmail.com</Text>
          </View>
          <View>
            <Text>Client ID: 5425</Text>
            <Text>Invoice #: 731725</Text>
            <Text>Date: {'7/23/2021'}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Canvas
            style={{ backgroundColor: 'black', height: 1, width: '100%' }}
          />
          <Canvas
            style={{
              backgroundColor: 'black',
              height: 1,
              width: '100%',
              marginTop: 2,
            }}
          />
          <View style={styles.table}>
            <View style={styles.rowTable1}>
              <Text style={{ textAlign: 'right' }}>Patient ID: {`4292`}</Text>
              <Text>Species: {`Canine`}</Text>
              <Text>Weight: {`23`} pounds</Text>
              <Text></Text>
            </View>
            <View style={styles.rowTable1}>
              <Text>Patient Name: {`Taki`}</Text>
              <Text>Breed: {` Shiba Inu`}</Text>
              <Text>Birthday: {`07/20/2014`}</Text>
              <Text>Sex: {`Neutered Male`}</Text>
            </View>
          </View>
          <Canvas
            style={{
              backgroundColor: 'black',
              height: 1,
              width: '100%',
              marginTop: 2,
            }}
          />
        </View>

        <View style={[styles.table, { marginTop: 10 }]}>
          <View style={[styles.tableColumn, styles.rowTable2]}>
            <Text style={{ width: '10%' }} />
            <Text style={{ width: '40%' }}>Description</Text>
            <Text style={{ width: '20%' }}>Staff Name</Text>
            <Text style={{ width: '15%' }}>Quantity</Text>
            <Text style={{ width: '15%' }}>Total</Text>
          </View>
          <View style={styles.rowTable2}>
            <Text style={{ width: '10%' }}>7/23/2021</Text>
            <Text style={{ width: '40%' }}>
              Misc. Lab (Cortisol Add On/ 8001)
            </Text>
            <Text style={{ width: '20%' }}>Dr. Anne Ray</Text>
            <Text style={{ width: '15%' }}>1.00</Text>
            <Text style={{ width: '15%' }}>$111.18</Text>
          </View>
        </View>

        <View style={styles.rowTable2}>
          <Text style={{ width: '10%' }} />
          <Text style={{ width: '40%' }} />
          <Text style={{ width: '20%' }} />
          <Text style={[styles.subTotal, { width: '15%' }]}>
            Patient Subtotal:
          </Text>
          <Text style={[styles.subTotal, { width: '15%' }]}>{`$111.18`}</Text>
        </View>

        <View>
          <Text style={{ textDecoration: 'underline' }}>Reminder</Text>
        </View>

        <View style={styles.reminderContainer}>
          <View style={styles.reminder}>
            <Text>07/20/2022</Text>
            <Text style={styles.reminderText}>
              {`Bordetella Reminder
                            Annual Wellness Exam Reminder
                            Blood Parasite Screen 4DX+ Reminder`}
            </Text>
          </View>
          <View style={styles.reminder}>
            <Text>07/20/2024</Text>
            <Text style={styles.reminderText}>
              {`DHPP Reminder
                            Rabies Reminder`}
            </Text>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <View>
            <View style={styles.totalColumn}>
              <Text
                style={[styles.columnHeader, { fontFamily: 'Helvetica-Bold' }]}
              >
                Invoice Total:
              </Text>
              <Text
                style={[styles.columnValue, { fontFamily: 'Helvetica-Bold' }]}
              >
                $111.18
              </Text>
            </View>
            <View style={styles.totalColumn}>
              <Text style={styles.columnHeader}>Total:</Text>
              <Text
                style={[
                  styles.columnValue,
                  { borderBottom: '1px solid black' },
                ]}
              >
                $111.18
              </Text>
            </View>
            <View style={styles.totalColumn}>
              <Text style={styles.columnHeader}>Balance Due:</Text>
              <Text style={styles.columnValue}>$111.18</Text>
            </View>
            <View style={styles.totalColumn}>
              <Text style={styles.columnHeader}>Previous Balance:</Text>
              <Text
                style={[
                  styles.columnValue,
                  { borderBottom: '1px solid black' },
                ]}
              >
                $0.00
              </Text>
            </View>
            <View style={styles.totalColumn}>
              <Text style={styles.columnHeader}>Balance Due:</Text>
              <Text
                style={[
                  styles.columnValue,
                  { borderBottom: '1px solid black' },
                ]}
              >
                $111.18
              </Text>
            </View>
            <View style={styles.totalColumn}>
              <Text style={styles.columnHeader}>
                VISA Card Number: ...XXXX0520:
              </Text>
              <Text
                style={[
                  styles.columnValue,
                  {
                    borderBottom: '1px solid black',
                    color: 'red',
                  },
                ]}
              >
                ($111.18)
              </Text>
            </View>
            <View style={styles.totalColumn}>
              <Text style={styles.columnHeader}>Less Payment:</Text>
              <Text
                style={[
                  styles.columnValue,
                  {
                    borderBottom: '1px solid black',
                    color: 'red',
                  },
                ]}
              >
                ($111.18)
              </Text>
            </View>
            <View style={styles.totalColumn}>
              <Text
                style={[styles.columnHeader, { fontFamily: 'Helvetica-Bold' }]}
              >
                Balance Due:
              </Text>
              <Text
                style={[
                  styles.columnValue,
                  {
                    fontFamily: 'Helvetica-Bold',
                    borderBottom: '1px solid black',
                  },
                ]}
              >
                $0.00
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Our doctors and staff thank you for choosing our Hospital. We
            appreciate your business and enjoy providing care for your pets.
            Thank You.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DocPDF2;
