import express from 'express';
import { config } from './config/default';
import { translateRouter } from './routes/translateRouter';

const app = express();

app.use(express.json());

app.use('/', translateRouter);

app.listen(config.port, config.hostName, () => {
  console.log(`Listening on port ${config.host}:${config.port}`);
});
