import { CourseModel } from '@dirtleague/common';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';

const CourseDetails = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const services = useRepositoryServices();
  const [result, setResult] = useState<CourseModel>();

  useEffect(() => {
    const doWork = async () => {
      const entity = await services?.courses.get(parseInt(id, 10), {
        include: ['aliases'],
      });

      setResult(entity);
    };

    doWork();
  }, [id, services?.courses]);

  if (!result) {
    return null;
  }

  return (
    <>
      <h1>Course ID {id}</h1>
      <div>{JSON.stringify(result.toJson())}</div>
    </>
  );
};

export default CourseDetails;
