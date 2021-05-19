import { CourseModel, Role } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Table, Button, Menu, Icon } from 'semantic-ui-react';
import IfAuthorized from '../../components/auth/if-admin';
import { useRepositoryServices } from '../../data-access/context';
import DeleteEntityButton from '../../components/generic/delete-entity-button';
import Breadcrumbs from '../../components/generic/breadcrumbs';
import { Courses } from '../../links';

const CourseList = (): ReactElement => {
  const { url } = useRouteMatch();
  const services = useRepositoryServices();
  const [result, setResult] = useState<CourseModel[]>();
  const [dummy, setDummy] = useState(false);

  const onDelete = useCallback(
    async id => {
      await services?.courses.delete(id);
      setDummy(v => !v);
    },
    [services?.courses]
  );

  // Node: Check `dummy` so if it changes we requery data.
  useEffect(() => {
    let isMounted = true;

    const doWork = async () => {
      const entities = await services?.courses.getAll();

      if (isMounted) {
        setResult(entities);
      }
    };

    doWork();

    return () => {
      isMounted = false;
    };
  }, [services?.courses, dummy]);

  return (
    <>
      <Breadcrumbs path={[Courses.List]} />
      <h1>Courses</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result?.map(course => (
            <Table.Row key={course.id}>
              <Table.Cell>{course.name}</Table.Cell>
              <Table.Cell textAlign="right">
                <Button as={Link} to={`${url}/${course.id}`} size="mini">
                  <Icon name="address book" />
                  View
                </Button>
                <IfAuthorized roles={[Role.CourseManagement]}>
                  <Button as={Link} to={`${url}/${course.id}/edit`} size="mini">
                    <Icon name="edit" />
                    Edit
                  </Button>
                  <DeleteEntityButton
                    id={course.id}
                    modelName="Course"
                    onDelete={onDelete}
                  />
                </IfAuthorized>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <IfAuthorized roles={[Role.CourseManagement]}>
                <Menu floated="right">
                  <Menu.Item as={Link} to={`${url}/new`}>
                    <Icon name="add circle" /> New Course
                  </Menu.Item>
                </Menu>
              </IfAuthorized>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default CourseList;
