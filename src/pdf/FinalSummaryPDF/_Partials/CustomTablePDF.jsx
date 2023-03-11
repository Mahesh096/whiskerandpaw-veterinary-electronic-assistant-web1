import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  tableContainer: {
    border: '1px',
    width: '100%',
    fontSize: '8px',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 'bold',
    justifyContent: 'center',
    textTransform: 'capitalize',
    height: '20px',
    fontFamily: 'Helvetica-Bold',
    alignItems: 'center',
    width: '100%',
    border: 0,
    borderBottom: '1px solid #000',
  },
  cell: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    borderBottom: '1px',
    height: 'auto',
    alignItems: 'center',
    margin: '-1px',
  },
  cells: {
    padding: '5px 10px 2px 10px',
    borderRightWidth: '1px',
    height: '100%',
  },
});
const CustomTable = ({ data, dimensions = [] }) => {
  const getColumns = (data) => {
    if (data?.length > 0) {
      return Object.keys(data[0]);
    }

    return [];
  };

  const columns = getColumns(data);

  return (
    <View>
      <View style={styles.tableContainer}>
        {!!columns?.length && (
          <>
            <View style={styles.tableHeader}>
              {columns?.map((column, key) => (
                <Text
                  key={key}
                  style={[
                    styles.cells,
                    {
                      width: dimensions.length
                        ? `${dimensions[key] || 25}%`
                        : `'${100 / columns.length}%'`,
                    },
                  ]}
                >
                  {column}
                </Text>
              ))}
            </View>
            <View>
              {data?.map((cell, key) => (
                <View style={styles.cell} key={key}>
                  {columns?.map((column, index) => (
                    <Text
                      style={[
                        styles.cells,
                        {
                          width: dimensions.length
                            ? `${dimensions[index] || 25}%`
                            : `'${100 / columns.length}%'`,
                        },
                      ]}
                      key={index}
                    >
                      {cell[column]}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default CustomTable;

CustomTable.propTypes = {
  data: PropTypes.array.isRequired,
  dimensions: PropTypes.array.isRequired,
};
