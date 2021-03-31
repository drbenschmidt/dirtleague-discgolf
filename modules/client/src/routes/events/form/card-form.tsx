/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement } from 'react';
import { Button, Grid, Icon, Segment } from 'semantic-ui-react';
import { CardModel, PlayerGroupModel } from '@dirtleague/common';
import Collection from '../../../components/forms/collection';
import PlayerGroupFormRow from './player-group-form-row';

export interface CardFormComponentProps {
  model: CardModel;
  onRemoveCard: (model: CardModel) => void;
}

const CardForm = (props: CardFormComponentProps): ReactElement => {
  const { model, onRemoveCard } = props;

  return (
    <Segment>
      <Grid>
        <Grid.Row textAlign="right">
          <Grid.Column width="16">
            <Button
              as="a"
              size="mini"
              onClick={() => onRemoveCard(model)}
              negative
            >
              <Icon name="delete" />
              Delete
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Collection
        tableColor="blue"
        buttonText="Add Player Group"
        label="Card"
        list={model.playerGroups}
        RowComponent={PlayerGroupFormRow}
        modelFactory={() => new PlayerGroupModel()}
      />
    </Segment>
  );
};

export default CardForm;
