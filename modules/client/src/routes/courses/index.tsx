import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

export const CourseList = (): ReactElement => {
  return <h1>Courses</h1>;
};

export const CourseDetails = (): ReactElement => {
  const { id } = useParams<any>();

  return <h1>Course ID {id}</h1>;
};
