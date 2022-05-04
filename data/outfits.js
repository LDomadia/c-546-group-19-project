const mongoCollections = require("../config/mongoCollections");
const validation = require("../validation/account_validation");
const outfits = mongoCollections.outfits;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

const errors_string = function (str, name) {
  if (!str || str == null) {
    throw `${name} is not initialized`;
  }

  if (typeof str !== "string") {
    throw `${name} must be type string`;
  }

  str = str.trim();

  if (str.length < 1) {
    throw `${name} cannot be an empty string`;
  }

  return str;
};

const errors_strlist = function (lst, name) {
  if (!lst || lst == null) {
    throw `${name} is not initialized`;
  }

  return lst.map((a) => errors_string(a));
};

const errors_clothes = function (lst, name) {
  if (!lst || lst == null) {
    throw `${name} is not initialized`;
  }

  return lst.map((a) => errors_clothing(a._id));
};

const errors_clothing = function (id, name) {
  if (!id || id == null) {
    throw `${name} is not initialized`;
  }

  if (!ObjectId.isValid(id)) throw `${name} must be a valid mongo id`;

  id = ObjectId(id);
  return id;
};

module.exports = {
  async getOutfitItems(username) {
    username = validation.checkUsername(username);
    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({ username: username });
    return userDocument.userOutfits;
  },
  async addNewOutfits(creator, clothes, status, outfitName, season, style) {
    let err = function (str) {
      return `Error: ${str} was not provided`;
    };
    let arg_names = [
      "creator",
      "clothes",
      "status",
      "outfitName",
      "season",
      "style",
    ];
    for (let i = 0; i < arg_names.length; i++) {
      if (!arguments[i]) {
        throw err(arg_names[i]);
      }
    }
    if (typeof creator !== "string") {
      throw "Error: creator should be a string";
    }
    if (typeof status !== "string") {
      throw "Error: status should be a string";
    }
    if (typeof outfitName !== "string") {
      throw "Error: outfit name should be a string";
    }
    creator = errors_string(creator, "creator");
    status = errors_string(status, "status");
    outfitName = errors_string(outfitName, "outfitName");

    season = errors_strlist(season, "season");
    style = errors_strlist(style, "style");
    clothes = errors_clothes(clothes, "clothes");

    const outfitsCollection = await outfits();
    let newOutfits = {
      creator: creator,
      clothes: clothes,
      likes: 0,
      status: status,
      outfitName: outfitName,
      season: season,
      style: style,
      comments: [],
    };
    const insertInfo = await outfitsCollection.insertOne(newOutfits);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add outfit";

    const newId = insertInfo.insertedId.toString();

    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne(
      { username: creator },
      {
        $push: {
          userOutfits: insertInfo.insertedId,
        },
      }
    );

    if (updateInfo.matchedCount == 0 || updateInfo.modifiedCount == 0)
      throw "Error: Failed to update user";

    return newId;
  },

  async addClothesToOutfit(outfit_id, cloth_ids) {
    outfit_id = errors_string(outfit_id, "outfit_id");
    cloth_ids = errors_strlist(cloth_ids, "cloth_ids");

    if (cloth_ids.map((id) => !ObjectId.isValid(id)).indexOf(true) > 0) {
      throw "invalid cloth id found";
    }

    const outfitsCollection = await outfits();

    let outfit = await outfitsCollection.findOne({ _id: ObjectId(outfit_id) });

    let new_outfit_data = {
      clothes: cloth_ids,
    };

    delete outfit._id;

    outfit = Object.assign(outfit, new_outfit_data);

    const updated_info = await outfitsCollection.updateOne(
      { _id: ObjectId(outfit_id) },
      { $set: outfit }
    );

    if (updated_info.modifiedCount === 0) {
      throw "Could not update outfit successfully";
    }

    return outfit_id;
  },
};
