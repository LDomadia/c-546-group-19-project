const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let url = (!process.env.MONGO_URL) ? process.env.MONGO_URI : process.env.MONGO_URL

const settings = {
  mongoConfig: {
    serverUrl: url,
    database: "CS546_group19_final",
  },
};

settings.mongoConfig.serverUrl = settings.mongoConfig.serverUrl.trim();
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
