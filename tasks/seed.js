const connection = require('../config/mongoConnection');
const data = require('../data/');
const closet = data.closet;

const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    const pfloyd = await closet.create("bob ross", "sweatshirt");
    console.log('Done seeding database');

    await connection.closeConnection();
}

main();