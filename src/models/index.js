const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

const config = JSON.parse(process.env.DBDATA);
const databases = Object.keys(config.databases);

const db = {};
let sequelize;

for (let i = 0; i < databases.length; ++i) {
  let database = databases[i];
  let dbConfig = config.databases[database];
  console.log(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
  db[database] = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.options);

  fs.readdirSync(__dirname + `/${database}`)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const model = require(path.join(__dirname + `/${database}`, file))(
        db[database],
        Sequelize.DataTypes
      );
      db[database][model.name] = model;
    });
}
for (let i = 0; i < databases.length; ++i) {
  let database = databases[i];
  Object.keys(db[database]).forEach((modelName) => {
    if (db[database][modelName].associate) {
      db[database][modelName].associate(db);
    }
  });
}

module.exports = db;
