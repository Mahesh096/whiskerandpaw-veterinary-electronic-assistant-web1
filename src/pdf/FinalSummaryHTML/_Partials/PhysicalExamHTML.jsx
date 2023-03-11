import React from 'react';
import PropTypes from 'prop-types';

const PhysicalExamHTML = ({ data }) => (
  <>
    <div>
      <h3 className="title">Physical Exam</h3>
    </div>
    <div>
      <ul>
        {data?.map((exam, key) => (
          <div key={key}>
            <li>{exam.name}</li>
            <ul>
              <li>Issues Listed: {exam.issues}</li>
              <li>Comments: {exam.comments}</li>
            </ul>
          </div>
        ))}
      </ul>
    </div>
  </>
);
export default PhysicalExamHTML;
PhysicalExamHTML.propTypes = {
  data: PropTypes.array.isRequired,
};
