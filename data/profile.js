const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
//const { use } = require("../routes/account");
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const isAlphanumeric = require("is-alphanumeric");
const validation = require("../validation/account_validation");

module.exports = {
  async checkPassword(username, password) {
    username = validation.checkUsername(username);
    password = validation.checkPassword(password);
    //check for alphanumeric
    //https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    username = username.toLowerCase();

    const userCollection = await users();
    const user = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });
    if (!user) throw "Either the username or password is invalid";

    let compare = false;

    try {
      compare = await bcrypt.compare(password, user.hashedPassword);
    } catch (e) {
      throw "Error: in comparing hashed password and inputted password";
    }

    if (compare) {
      return user;
    } else throw "Password is incorrect";
  },

  //change password

  async changePassword(username, password, password2) {
    //check id
    //see lab6

    username = validation.checkUsername(username);
    password = validation.checkPassword(password);
    password2 = validation.checkPassword(password2);
    username = username.toLowerCase();

    if (password !== password2) throw "passwords do not match";

    const userCollection = await users();
    //id=validation.checkId(id);

    const user = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    let hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      throw "invalid username";
    }
    if (!user.bio) {
      user.bio = null;
    }
    if (!user.stores) {
      user.stores = null;
    }

    let compare = false;

    try {
      compare = await bcrypt.compare(password, user.hashedPassword);
    } catch (e) {
      throw "Error: in comparing hashed password and inputted password";
    }

    if (compare) throw "password should not be the same as before";

    const updatedInfo = await userCollection.updateOne(
      { username: username },
      { $set: { hashedPassword: hashedPassword } }
    );
    const modifieduser = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (updatedInfo.modifiedCount === 0) {
      throw "could not update user successfully";
    }
    modifieduser._id = modifieduser._id.toString();
    return modifieduser;
  },

  //change bio

  async changeBio(username, bio) {
    //check id
    //see lab6
    bio = validation.checkString(bio);
    bio = bio.trim();
    username = validation.checkUsername(username);
    username = username.toLowerCase();
    const userCollection = await users();

    const user = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (!user) {
      throw "no user found";
    }

    if (!user.stores) {
      user.stores = null;
    }

    const updatedInfo = await userCollection.updateOne(
      { username: username },
      { $set: { bio: bio } }
    );

    const modifieduser = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (updatedInfo.modifiedCount === 0) {
      throw "could not update user successfully";
    }
    modifieduser._id = modifieduser._id.toString();
    return modifieduser;
  },

  //add a favorite store

  async changeStore(username, storename, storelink) {
    //check id
    //see lab6

    store = validation.checkString(storename);
    website = validation.checkWebsite(storelink);
    username = validation.checkUsername(username);
    username = username.toLowerCase();
    const userCollection = await users();

    const user = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (!user) {
      throw "invalid Id";
    }

    if (!user.bio) {
      user.bio = "N/A";
    }

    //deal with new store
    let newstore = {
      name: store,
      website: website,
    };

    //check duplicate

    //if no user liked store
    if (!user.stores) {
      //create new array
      user.stores = [];
    } else {
      for (let i = 0; i < user.stores.length; i++) {
        if (user.stores[i].name.toLowerCase() == store.toLowerCase())
          throw "duplicate store names not allowed";
      }
    }

    const updatedInfo = await userCollection.updateOne(
      { username: username },
      { $push: { stores: newstore } }
    );

    const modifieduser = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (updatedInfo.modifiedCount === 0) {
      throw "could not update user successfully";
    }
    modifieduser._id = modifieduser._id.toString();
    return modifieduser;
  },

  async get(username) {
    username = validation.checkUsername(username);
    username = username.toLowerCase();
    const userCollection = await users();

    //get the user
    const user = await userCollection.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (!user) {
      throw "invalid username";
    }

    user._id = user._id.toString();

    return user;
  },

  async removeAccount(username) {
    username = validation.checkUsername(username);
    username = username.toLowerCase();
    const userCollection = await users();

    const deletionInfo = await userCollection.deleteOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with username of ${username}`;
    }
    return { deleted: true };
  },
};
