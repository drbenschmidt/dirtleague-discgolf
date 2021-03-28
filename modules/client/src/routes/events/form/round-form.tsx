/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useCallback, useState, useRef } from 'react';
import {
  isNil,
  RoundModel,
  CourseModel,
  CourseLayoutModel,
} from '@dirtleague/common';
import { Form } from 'semantic-ui-react';
import { useRepositoryServices } from '../../../data-access/context';
import { useSelectBinding } from '../../../hooks/forms';
import EntitySearch from '../../../components/forms/entity-search';
import useSubscription from '../../../hooks/useSubscription';
import CardList from './card-list';

export interface RoundFormComponentProps {
  model: RoundModel;
}

const RoundForm = (props: RoundFormComponentProps): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const layoutBinding = useSelectBinding(modelRef, 'courseLayoutId');
  const courseBinding = useSelectBinding(modelRef, 'courseId');
  const services = useRepositoryServices();
  const [courseId, setCourseId] = useState(modelRef.current.courseId);
  useSubscription(modelRef.current, 'courseId', setCourseId);

  // TODO: Gross.
  const courseSearch = useCallback(
    async (query: string) => {
      const courses = await services?.courses.getAll();
      const mapper = (course: CourseModel) => ({
        text: course.name,
        value: course.id,
      });

      if (!courses) {
        return [];
      }

      if (query.length === 0) {
        return courses.map(mapper);
      }

      return courses
        ?.filter(course =>
          course.name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
        )
        .map(mapper);
    },
    [services?.courses]
  );

  // TODO: Same as above, baby just pooped so I don't have time.
  const courseLayoutSearch = useCallback(
    async (query: string) => {
      if (isNil(courseId)) {
        return [];
      }

      const courseLayouts = await services?.courses.getLayoutsForCourse(
        courseId
      );
      const mapper = (course: CourseLayoutModel) => ({
        text: course.name,
        value: course.id,
      });

      if (!courseLayouts) {
        return [];
      }

      if (query.length === 0) {
        return courseLayouts.map(mapper);
      }

      return courseLayouts
        ?.filter(layout =>
          layout.name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
        )
        .map(mapper);
    },
    [courseId, services?.courses]
  );

  return (
    <>
      <Form.Group widths="equal">
        <EntitySearch
          {...courseBinding}
          label="Course"
          searcher={courseSearch}
        />
        <EntitySearch
          {...layoutBinding}
          label="Course Layout"
          searcher={courseLayoutSearch}
          disabled={isNil(courseId)}
        />
      </Form.Group>
      <CardList model={model.cards} />
    </>
  );
};

export default RoundForm;
