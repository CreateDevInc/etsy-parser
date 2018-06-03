module.exports = {
  client: 'mysql',
  useNullAsDefaults: true,
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB || 'etsy_scraper', // eslint-disable-line
    multipleStatements: process.env.DB_MULTIPLE_STATEMENTS || true,
  },
  pool: { min: 1, max: 10 },
};
