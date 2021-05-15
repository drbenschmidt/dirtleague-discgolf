import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';
import { get } from '@dirtleague/common';

// eslint-disable-next-line no-useless-escape
const keyRegex = /\:\w*/g;

export interface BreadcrumbPiece {
  content: string;
  to: string;
}

export interface BreadcrumbState {
  id?: number | string;
  name?: string;
}

export type BreadcrumbPart =
  | BreadcrumbPiece
  | [BreadcrumbPiece, BreadcrumbState];

export type BreadcrumbPath = Array<BreadcrumbPart>;

const applyState = (input: string, state?: BreadcrumbState): string => {
  if (!state) {
    return input;
  }

  const matches = [...input.matchAll(keyRegex)];
  let result = input;

  matches.forEach(match => {
    const [accessor] = match;
    const [, key] = accessor.split(':'); // Split? meh.
    const value = get<string>(state, key);

    if (value) {
      result = result.replaceAll(accessor, value);
    }
  });

  return result;
};

const buildBreadcrumb = (props: BreadcrumbPart, active: string) => {
  let model: BreadcrumbPiece;
  let state: BreadcrumbState | undefined;

  if (Array.isArray(props)) {
    [model, state] = props as [BreadcrumbPiece, BreadcrumbState];
  } else {
    model = props as BreadcrumbPiece;
  }

  const { content, to } = model;

  return {
    key: content.toLowerCase(),
    content: applyState(content, state),
    as: Link,
    active: content === active,
    to: applyState(to, state),
  };
};

export interface BreadcrumbProps {
  path: BreadcrumbPath;
}

const Breadcrumbs = (props: BreadcrumbProps): ReactElement => {
  const { path } = props;

  const lastPath = path[path.length - 1];
  let active: string;

  if (Array.isArray(lastPath)) {
    active = lastPath[0].content;
  } else {
    active = lastPath.content;
  }

  const sections = [
    { key: 'Home', content: 'Home', as: Link, to: '/' },
    ...path.map(p => buildBreadcrumb(p, active)),
  ];

  return <Breadcrumb icon="right angle" sections={sections} />;
};

export default Breadcrumbs;
