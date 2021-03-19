import React from 'react';
import { CollapsibleItem, Icon } from 'react-materialize';
import { FindAClass, CreateAClass, ViewCourses } from './index';

const ClassOptions = () => {
  return (
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
  );
};

export default ClassOptions;
