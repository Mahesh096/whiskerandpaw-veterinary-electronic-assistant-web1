import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

export const PhysicalExamList = ({ name, issues, comments }) => {
  const showIssues = !issues?.includes('N/A');

  return (
    <View
      style={{
        flexDirection: 'column',
        width: 400,
        marginTop: 10,
        fontSize: 10,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text style={{ marginHorizontal: 8 }}>•</Text>
        <Text style={{ textTransform: 'capitalize' }}>
          {name} - {showIssues ? 'Abnormal' : 'Normal'}
        </Text>
      </View>
      {showIssues && (
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ marginHorizontal: 18 }}>•</Text>
          <Text>Issues Listed: {issues} </Text>
        </View>
      )}
      {showIssues && (
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ marginHorizontal: 18 }}>•</Text>
          <Text>Comments: {comments || 'N/A'} </Text>
        </View>
      )}
    </View>
  );
};

PhysicalExamList.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
};
