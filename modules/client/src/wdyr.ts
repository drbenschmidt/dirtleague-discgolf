/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';

const enable = false;

if (process.env.NODE_ENV === 'development' && enable) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOnDifferentValues: true,
  });
}
