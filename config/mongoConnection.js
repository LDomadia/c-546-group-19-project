const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const settings = {
  mongoConfig: {
    serverUrl: process.env.MONGO_URL,
    database: "CS546_group19_final",
  },
};

const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  dbConnection: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
