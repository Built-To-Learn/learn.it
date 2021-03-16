import React from 'react';
import { connect } from 'react-redux';
// import { loadCourses } from '../store/courses'
// import { loadEnrollments } from '../store/enrollments'
// import M from 'materialize-css'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize';
import { FindAClass, CreateAClass, ViewCourses } from './index';

const ClassOptions = () => {
  return (
    // <Collapsible>
    <CollapsibleItem
      expanded={false}
      header="Class Options"
      icon={<Icon>assignment</Icon>}
      node="div"
      onSelect={() => {}}
    >
      <CreateAClass />
      <FindAClass />
      <ViewCourses />
    </CollapsibleItem>
    // </Collapsible>
  );
};

export default ClassOptions;
