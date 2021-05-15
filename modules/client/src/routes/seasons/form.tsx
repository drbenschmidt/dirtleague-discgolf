import { isNil, SeasonModel } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import TextInput from '../../components/forms/text-input';
import DateInput from '../../components/forms/date-picker';
import { useRepositoryServices } from '../../data-access/context';
import {
  useInputBinding,
  useTransaction,
  useDateBinding,
} from '../../hooks/forms';
import { EntityDetailsParams } from '../types';
import FocusOnMount from '../../components/generic/focus-on-mount';
import Breadcrumbs, {
  BreadcrumbPart,
} from '../../components/generic/breadcrumbs';
import { Seasons } from '../../links';
import useModelValidation from '../../hooks/useModelValidation';

interface SeasonFormComponentProps {
  seasonModel: SeasonModel;
  isEditing: boolean;
}

const SeasonFormComponent = (
  props: SeasonFormComponentProps
): ReactElement | null => {
  const { seasonModel, isEditing } = props;
  const { model } = useTransaction<SeasonModel>(seasonModel);
  const nameBinding = useInputBinding(model, 'name');
  const startDateBinding = useDateBinding(model, 'startDate');
  const endDateBinding = useDateBinding(model, 'endDate');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();
  const isValid = useModelValidation(model);
  const services = useRepositoryServices();

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        if (!(await isValid())) {
          return;
        }

        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.seasons.update(model.current);

            history.push(`/seasons/${model.current.id}`);
          } else {
            await services?.seasons.create(model.current);

            history.push('/seasons');
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [model, isValid, isEditing, services?.seasons, history]);

  const title = isEditing ? 'Edit Season' : 'New Season';
  const pathPart = isEditing
    ? ([
        Seasons.Edit,
        { name: model.current?.name, id: model.current?.id },
      ] as BreadcrumbPart)
    : Seasons.New;

  return (
    <>
      <Breadcrumbs path={[Seasons.List, pathPart]} />
      <h1>{title}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <FocusOnMount>
            {ref => (
              <TextInput
                {...nameBinding}
                ref={ref}
                fluid
                label="Season Name"
                placeholder="Season Name"
              />
            )}
          </FocusOnMount>
          <DateInput {...startDateBinding} label="Start Date" />
          <DateInput {...endDateBinding} label="End Date" />
        </Form.Group>
        <Form.Button positive content="Submit" />
      </Form>
    </>
  );
};

const SeasonForm = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [seasonModel, setSeasonModel] = useState<SeasonModel>();

  // Get the player from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getSeason = async () => {
        const response = await services?.seasons.get(parseInt(id, 10));

        if (response) {
          setSeasonModel(response);
        }
      };

      getSeason();
    } else {
      const response = new SeasonModel();

      setSeasonModel(response);
    }
  }, [id, isEditing, services?.seasons]);

  if (!seasonModel) {
    return null;
  }

  return (
    <SeasonFormComponent seasonModel={seasonModel} isEditing={isEditing} />
  );
};

export default SeasonForm;
