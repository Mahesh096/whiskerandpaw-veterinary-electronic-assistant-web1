import React from 'react';
import PropTypes from 'prop-types';

const CustomTableHTML = ({ data }) => {
  const getColumns = (data) => {
    return data ? Object.keys(data[0]) : [];
  };
  return (
    <div>
      <table border={1} style={{ width: '80%' }}>
        <thead className="tableHeader">
          {getColumns(data)?.map((column) => (
            <>
              <th>{column}</th>
            </>
          ))}
        </thead>
        <tbody>
          {data?.map((cell, key) => (
            <>
              <tr key={key}>
                {getColumns(data)?.map((column, index) => (
                  <td key={index}>{cell[column]}</td>
                ))}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTableHTML;

CustomTableHTML.propTypes = {
  data: PropTypes.array.isRequired,
};
