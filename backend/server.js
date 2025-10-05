import express from 'express';

const app = express();
const port = 3000;

app.get('/zoom-in', (req, res) => {
  
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});