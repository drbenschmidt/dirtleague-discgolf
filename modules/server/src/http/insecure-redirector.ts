import express from 'express';

const app = express();

// set up a route to redirect http to https
app.get('*', (req, res) => {
  const {
    headers: { host },
    url,
  } = req;

  res.redirect(`https://${host}${url}`);
});

export default app;
