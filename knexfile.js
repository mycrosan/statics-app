// Update with your config settings.

module.exports = {
  production: {
    client: 'mysql',
    connection: {
      database: 'production_api',
      user:     'root',
      password: 'password',
      host: 'localhost',
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
