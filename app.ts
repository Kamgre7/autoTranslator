import express from 'express';
import * as dotenv from 'dotenv';
import { config } from './config/default';
import { translateRouter } from './routes/translateRouter';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/translate', translateRouter);

app.listen(config.port, config.hostName, () => {
  console.log(`Listening on port ${config.host}:${config.port}`);
});
