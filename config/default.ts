import * as dotenv from 'dotenv';
dotenv.config();

interface IConfig {
  port: number;
  host: string;
  hostName: string;
  cacheFilePath: string;
  googleCloud: {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
  };
}

export const config: IConfig = {
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST!,
  hostName: process.env.HOST_NAME!,
  cacheFilePath: process.env.CACHE_FILE_PATH!,
  googleCloud: {
    type: process.env.GOOGLE_CLOUD_TYPE!,
    project_id: process.env.GOOGLE_PROJECT_ID!,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID!,
    private_key: process.env.GOOGLE_PRIVATE_KEY!,
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    auth_uri: process.env.GOOGLE_AUTH_URI!,
    token_uri: process.env.GOOGLE_TOKEN_URL!,
    auth_provider_x509_cert_url:
      process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL!,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL!,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN!,
  },
};
