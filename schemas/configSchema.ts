import { z } from 'zod';

export const ConfigSchema = z.object({
  port: z
    .string()
    .nonempty()
    .transform((arg) => (isNaN(parseInt(arg)) ? 3001 : Number(arg))),
  host: z.string().nonempty(),
  hostName: z.string().nonempty(),
  cacheFilePath: z.string().nonempty(),
  googleCloud: z.object({
    type: z.string().nonempty(),
    project_id: z.string().nonempty(),
    private_key_id: z.string().nonempty(),
    private_key: z.string().nonempty(),
    client_email: z.string().nonempty(),
    client_id: z.string().nonempty(),
    auth_uri: z.string().nonempty(),
    token_uri: z.string().nonempty(),
    auth_provider_x509_cert_url: z.string().nonempty(),
    client_x509_cert_url: z.string().nonempty(),
    universe_domain: z.string().nonempty(),
  }),
});
