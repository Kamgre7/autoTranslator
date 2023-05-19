import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST,
  hostName: process.env.HOST_NAME,
};
