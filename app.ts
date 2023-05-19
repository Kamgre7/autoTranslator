import express from 'express';
import * as dotenv from 'dotenv';
import { config } from './config/default';

dotenv.config();

const app = express();

app.use(express.json());

app.listen(config.port, config.hostName, () => {
  console.log(`Listening on port ${config.host}:${config.port}`);
});
