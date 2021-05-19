import { CardModel, Role, RoundModel } from '@dirtleague/common';
import { ReactElement, useCallback } from 'react';
import { Button, Grid, Icon } from 'semantic-ui-react';
import IfAuthorized from '../../../components/auth/if-admin';
import { useRepositoryServices } from '../../../data-access/context';
import useModelState from '../../../hooks/useModelState';
import CardDetails from './card-details';

interface RoundDetailsProps {
  model: RoundModel;
}

const RoundDetails = (props: RoundDetailsProps): ReactElement => {
  const { model } = props;
  const services = useRepositoryServices();
  const [isComplete] = useModelState<boolean>(model, 'isComplete');

  const onCompleteClick = useCallback(async () => {
    await services?.events.markRoundComplete(model.id);
    model.isComplete = true;
  }, [model, services?.events]);

  return (
    <>
      <Grid style={{ marginBottom: '10px' }}>
        <Grid.Row>
          <Grid.Column width="8" floated="left">
            <div>Course: {model.course?.name}</div>
            <div>Layout: {model.courseLayout?.name}</div>
          </Grid.Column>
          <Grid.Column width="8" floated="right" textAlign="right">
            <IfAuthorized roles={[Role.EventManagement]}>
              <Button
                as="a"
                disabled={isComplete}
                positive
                onClick={onCompleteClick}
              >
                <Icon name="checkmark" />
                Complete
              </Button>
            </IfAuthorized>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div>
        {model.cards.toArray().map((card: CardModel) => (
          <CardDetails
            model={card}
            layout={model.courseLayout}
            eventId={model.eventId}
            isComplete={isComplete}
          />
        ))}
      </div>
    </>
  );
};

export default RoundDetails;
