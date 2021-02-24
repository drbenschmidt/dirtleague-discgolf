import { Link, useRouteMatch, useParams } from 'react-router-dom';

export const CourseList = () => {
  return <h1>Courses</h1>;
};

export const CourseDetails = () => {
  const { id } = useParams<any>();

  return <h1>Course ID {id}</h1>; 
};
