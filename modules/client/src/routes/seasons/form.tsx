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

const SeasonFormComponent = (props: any): ReactElement | null => {
  const { seasonModel, isEditing, services } = props;
  const { model } = useTransaction<SeasonModel>(seasonModel);
  const nameBinding = useInputBinding(model, 'name');
  const startDateBinding = useDateBinding(model, 'startDate');
  const endDateBinding = useDateBinding(model, 'endDate');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.seasons.update(model.current);

            history.push(`/seasons/${model.current.id}`);
          } else {
            await services?.seasons.create(model.current);

            // TODO: Move to season view?
            history.push('/seasons');
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [isEditing, model, services?.seasons, history]);

  return (
    <>
      <h1>{isEditing ? 'Edit Seasons' : 'New Seasons'}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <TextInput
            {...nameBinding}
            fluid
            label="Season Name"
            placeholder="Season Name"
          />
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
    <SeasonFormComponent
      seasonModel={seasonModel}
      isEditing={isEditing}
      services={services}
    />
  );
};

export default SeasonForm;
