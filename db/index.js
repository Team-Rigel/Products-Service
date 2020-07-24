const { config } = require("./config");

const { Pool, Client } = require("pg");

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
