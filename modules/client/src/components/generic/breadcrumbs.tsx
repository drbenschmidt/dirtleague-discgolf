import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';

export interface BreadcrumbPiece {
  content: string;
  to: string;
}

const buildBreadcrumb = (props: BreadcrumbPiece, active: string) => {
  const { content, to } = props;

  return {
    key: content.toLowerCase(),
    content,
    as: Link,
    active: content === active,
    to,
  };
};

export interface BreadcrumbProps {
  path: BreadcrumbPiece[];
}

const Breadcrumbs = (props: BreadcrumbProps): ReactElement => {
  const { path } = props;

  const active = path[path.length - 1].content;

  const sections = [
    { key: 'Home', content: 'Home', as: Link, to: '/' },
    ...path.map(p => buildBreadcrumb(p, active)),
  ];

  return <Breadcrumb icon="right angle" sections={sections} />;
};

export default Breadcrumbs;
