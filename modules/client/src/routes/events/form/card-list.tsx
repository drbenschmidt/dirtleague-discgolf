/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useCallback, useState } from 'react';
import { CardModel } from '@dirtleague/common';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';
import { LinkedList } from 'linked-list-typescript';
import CardForm from './card-form';

export interface CardListComponentProps {
  model: LinkedList<CardModel>;
}

const CardList = (props: CardListComponentProps): ReactElement => {
  const { model } = props;
  const [, setDummy] = useState(false);

  const addButton = useCallback(() => {
    model.append(new CardModel());
    setDummy(d => !d);
  }, [model]);

  if (model.length === 0) {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="id card outline" />
          No Cards have been added for this round.
        </Header>
        <Button primary as="a" onClick={addButton}>
          Add Card
        </Button>
      </Segment>
    );
  }

  return (
    <>
      <Segment>
        {model.toArray().map(card => (
          <CardForm model={card} />
        ))}
        <Button primary as="a" onClick={addButton}>
          Add Card
        </Button>
      </Segment>
    </>
  );
};

export default CardList;
