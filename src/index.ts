import app from './app';

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`This Server is listening on ${port}`);
});
