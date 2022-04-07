const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
//const { use } = require("../routes/account");
const bcrypt = require("bcryptjs");

//const validation = require("../validation");

module.exports = {
  async addNewUser(username, password) {
    if (!username) throw "Error: username was not provided";
    if (!password) throw "Error: password was not provided";

    if (typeof username !== "string")
      throw "Error: username should be a string";
    if (typeof password !== "string")
      throw "Error: password should be a string";

    if (username.indexOf(" ") >= 0)
      throw "Error: username should not have any spaces";
    if (password.indexOf(" ") >= 0)
      throw "Error: password should not have any spaces";
    username = username.trim();
    password = password.trim();
    if (username.length < 2)
      throw "Error: username must have at least two characters";
    if (password.length < 8)
      throw "Error: password must have at least eight characters";
    const userCollection = await users();
    const existingUser = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });
    if (existingUser != null) throw "Error: username is already taken";
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = {
      username: username,
      hashedPassword: hashedPassword,
      userClothes: [],
      userOutfits: [],
      userLikes: [],
      userSaves: [],
      statistics: {
        type: {
          tops: 0,
          bottoms: 0,
          dresses: 0,
          shoes: 0,
          accessories: 0,
          outerwear: 0,
          socks: 0,
        },
        "colors-patterns": {},
        brands: {},
      },
      calendar: {},
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add band";

    const newId = insertInfo.insertedId.toString();
    return newId;
  },
};
