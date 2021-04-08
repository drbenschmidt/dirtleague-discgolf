import { ReactElement, useCallback, useEffect, useState, memo } from 'react';
import { isNil, CourseModel, CourseLayoutModel } from '@dirtleague/common';
import { useParams, useHistory } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import TextInput from '../../../components/forms/text-input';
import TabCollection from '../../../components/forms/tab-collection';
import { useRepositoryServices } from '../../../data-access/context';
import { useInputBinding, useTransaction } from '../../../hooks/forms';
import { EntityDetailsParams } from '../../types';
import CourseLayoutForm from './course-layout-form';
import FocusOnMount from '../../../components/generic/focus-on-mount';
import Breadcrumbs, {
  BreadcrumbPart,
} from '../../../components/generic/breadcrumbs';
import { Courses } from '../../../links';
import useModelValidation from '../../../hooks/useModelValidation';

const CourseFormComponent = (props: any): ReactElement | null => {
  const { entityModel, isEditing } = props;
  const services = useRepositoryServices();
  const { model } = useTransaction<CourseModel>(entityModel);
  const nameBinding = useInputBinding(model, 'name');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();
  const isValid = useModelValidation(model);

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        if (!(await isValid())) {
          return;
        }

        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.courses.update(model.current);

            history.push(`/courses/${model.current.id}`);
          } else {
            const response = await services?.courses.create(model.current);

            history.push(`/courses/${response?.id}`);
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [model, isValid, isEditing, services?.courses, history]);

  const modelFactory = useCallback(() => {
    const length = model.current?.layouts.length || 0;

    return new CourseLayoutModel({
      name: `Layout ${length + 1}`,
      courseId: model.current?.id,
    });
  }, [model]);

  const title = isEditing ? 'Edit Course' : 'New Course';
  const pathPart = isEditing
    ? ([
        Courses.Edit,
        { name: model.current?.name, id: model.current?.id },
      ] as BreadcrumbPart)
    : Courses.New;

  return (
    <>
      <Breadcrumbs path={[Courses.List, pathPart]} />
      <h1>{title}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <FocusOnMount>
            {ref => (
              <TextInput
                {...nameBinding}
                ref={ref}
                fluid
                label="Name"
                placeholder="Course Name"
              />
            )}
          </FocusOnMount>
        </Form.Group>
        <TabCollection
          mode="form"
          label="Layouts"
          TabComponent={CourseLayoutForm}
          list={model.current?.layouts}
          modelFactory={modelFactory}
        />
        <Form.Button positive content="Submit" />
      </Form>
    </>
  );
};

const CourseForm = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [entityModel, setEntityModel] = useState<CourseModel>();

  // Get the entity from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getCourse = async () => {
        const response = await services?.courses.get(parseInt(id, 10), {
          include: ['layouts', 'holes'],
        });

        if (response) {
          setEntityModel(response);
        }
      };

      getCourse();
    } else {
      const response = new CourseModel({
        layouts: [
          {
            name: 'Layout 1',
          },
        ],
      });

      setEntityModel(response);
    }
  }, [id, isEditing, services?.courses]);

  if (!entityModel) {
    return null;
  }

  return (
    <CourseFormComponent
      entityModel={entityModel}
      isEditing={isEditing}
      services={services}
    />
  );
};

export default memo(CourseForm);
