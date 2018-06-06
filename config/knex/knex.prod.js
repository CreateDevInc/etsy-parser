module.exports = {
  client: 'mysql',
  useNullAsDefaults: true,
  connection: {
    host: process.env.DB_HOST || 'dev.cxpgfix6dydr.us-east-1.rds.amazonaws.com',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USERNAME || 'createdev',
    password: process.env.DB_PASSWORD || 'vamosbatizaromundo231',
    database: process.env.DB || 'etsy_scraper', // eslint-disable-line
    multipleStatements: process.env.DB_MULTIPLE_STATEMENTS || true,
  },
  pool: { min: 1, max: 10 },
};
