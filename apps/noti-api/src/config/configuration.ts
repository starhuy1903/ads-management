export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
  },
  agendaDb: process.env.AGENDA_DB,
  sourceEmail: process.env.SOURCE_EMAIL
});
