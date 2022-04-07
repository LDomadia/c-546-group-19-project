const connection = require('../config/mongoConnection');
const data = require('../data/');

const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    console.log('Done seeding database');

    await connection.closeConnection();
}

main();