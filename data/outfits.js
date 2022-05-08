const mongoCollections = require("../config/mongoCollections");
const validation = require("../validation/account_validation");
const outfitValidation = require("../validation/outfit_validation");
const clothesData = require("../data/clothes");
const accountData = require("../data/account");
const outfits = mongoCollections.outfits;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const moment = require("moment");
const { checkId } = require("../validation/account_validation");

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

  return lst.map((a) => errors_clothing(a));
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
  async addNewOutfits(creator, clothes, status, outfitName, seasons, styles) {
    creator = validation.checkUsername(creator);
    outfitName = outfitValidation.checkOutfitName(outfitName);
    seasons = outfitValidation.checkSeasons(seasons);
    status = outfitValidation.checkStatus(status);
    styles = outfitValidation.checkStyles(styles);
    clothes = outfitValidation.checkIdArrays(clothes);

    let validOutfit = clothesData.checkTypes(clothes);
    const outfitsCollection = await outfits();
    let newOutfits = {
      creator: creator,
      clothes: clothes,
      likes: [],
      likes_count: 0,
      status: status,
      outfitName: outfitName,
      season: seasons,
      style: styles,
      comments: [],
      saves: [],
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
  async getUserOutfits(username) {
    username = validation.checkUsername(username);
    const outfitsCollection = await outfits();
    if (outfitsCollection) {
      const userOutfits = await outfitsCollection
        .find({ creator: username })
        .toArray();
      if (userOutfits) {
        for (let outfit of userOutfits) {
          outfit["clothingData"] = [];
          for (let clothingId of outfit.clothes) {
            const clothingItem = await clothesData.getClothingItemById(
              clothingId.toString()
            );
            if (clothingItem) outfit["clothingData"].push(clothingItem);
            else throw "Error: Failed to find Clothing Item";
          }
        }
      }
      return userOutfits;
    } else throw "Error: Failed to load outfits";
  },
  async getAllOutfits() {
    const outfitsCollection = await outfits();
    if (outfitsCollection) {
      const publicOutfits = await outfitsCollection
        .find({ status: "public" })
        .sort({ likes_count: -1 })
        .toArray();

      if (publicOutfits) {
        for (let outfit of publicOutfits) {
          outfit["clothingData"] = [];
          for (let clothingId of outfit.clothes) {
            const clothingItem = await clothesData.getClothingItemById(
              clothingId.toString()
            );
            if (clothingItem) outfit["clothingData"].push(clothingItem);
            else throw "Error: Failed to find Clothing Item";
          }
        }
      }
      return publicOutfits;
    }
    throw "Error: Failed to load outfits";
  },
  async updateUserOutfit(
    creator,
    outfitId,
    clothes,
    status,
    outfitName,
    seasons,
    styles
  ) {
    creator = validation.checkUsername(creator);
    outfitId = ObjectId(outfitValidation.checkId(outfitId));
    seasons = outfitValidation.checkSeasons(seasons);
    status = outfitValidation.checkStatus(status);
    styles = outfitValidation.checkStyles(styles);
    clothes = outfitValidation.checkIdArrays(clothes);
    let validOutfit = clothesData.checkTypes(clothes);
    const outfitsCollection = await outfits();
    const updateInfo = await outfitsCollection.updateOne(
      {
        creator: creator,
        _id: outfitId,
      },
      {
        $set: {
          clothes: clothes,
          status: status,
          outfitName: outfitName,
          season: seasons,
          style: styles,
        },
      }
    );
    if (updateInfo.matchedCount == 0) throw "Error: Failed to edit outfit";
    return { updated: true };
  },
  async delUserOutfit(username, outfitId) {
    username = validation.checkUsername(username);
    outfitId = ObjectId(outfitValidation.checkId(outfitId));

    const usersCollection = await users();
    const userUpdate = await usersCollection.updateOne(
      { username: username },
      {
        $pull: { userOutfits: outfitId },
      }
    );
    if (userUpdate.matchedCount == 0 || userUpdate.modifiedCount == 0) {
      throw "Error: Failed to delete outfit from user";
    }

    const outfitsCollection = await outfits();
    if (!outfitsCollection) throw "Error: could not retrieve outfits";
    const deletionInfo = await outfitsCollection.findOneAndDelete({
      _id: outfitId,
      creator: username,
    });

    if (!deletionInfo) {
      throw `Could not delete band with id of ${id}`;
    }
    return `${deletionInfo.value.outfitName} has been successfully deleted!`;
  },
  async getUserOutfitById(username, outfitId) {
    username = validation.checkUsername(username);
    outfitId = ObjectId(outfitValidation.checkId(outfitId));
    const outfitsCollection = await outfits();
    const outfit = await outfitsCollection.findOne({
      creator: username,
      _id: outfitId,
    });
    if (!outfit) "Error: could not find outfit";

    return outfit;
  },
  async makeAllOutfitsPublic(username) {
    username = validation.checkUsername(username);
    const outfitsCollection = await outfits();
    if (!outfitsCollection) throw "Error: could not retrieve outfits";

    let outfitsArr = await this.getUserOutfits(username);

    if (outfitsArr.length === 0)
      throw "Error: user does not have any outfits to make public";
    const updateInfo = await outfitsCollection.updateMany(
      { creator: username },
      { $set: { status: "public" } }
    );

    if (!updateInfo.acknowledged || updateInfo.matchedCount == 0)
      throw "Error: could not make outfits public";

    return { updated: true };
  },
  async likeOutfit(id, user) {
    id = ObjectId(validation.checkId(id));
    user = validation.checkUsername(user);

    const usersCollection = await users();
    const userDoc = await usersCollection.findOne({ username: user });
    if (!userDoc) throw "Error: User does not exist";
    const outfitsCollection = await outfits();
    let isLiked = false;
    let status = "";
    userDoc.userLikes.forEach((outfit) => {
      if (outfit.toString() == id.toString()) {
        isLiked = true;
      }
    });
    if (isLiked) {
      // unlike the outfit
      const removeLike = await usersCollection.updateOne(
        { username: user },
        {
          $pull: { userLikes: id },
        }
      );
      if (removeLike.matchedCount == 0 || removeLike.modifiedCount == 0)
        throw "Error: Failed to remove like from User document";

      const theOutfit = await outfitsCollection.updateOne(
        { _id: id },
        {
          $pull: { likes: userDoc._id },
          $inc: { likes_count: -1 },
        }
      );
      if (theOutfit.matchedCount == 0 || theOutfit.modifiedCount == 0)
        throw "Error: Failed to remove like from User document";
      status = '<i class="fa-regular fa-heart"></i>';
    } else {
      // like the outfit
      const removeLike = await usersCollection.updateOne(
        { username: user },
        {
          $push: { userLikes: id },
        }
      );
      if (removeLike.matchedCount == 0 || removeLike.modifiedCount == 0)
        throw "Error: Failed to add like to User document";

      const theOutfit = await outfitsCollection.updateOne(
        { _id: id },
        {
          $push: { likes: userDoc._id },
          $inc: { likes_count: 1 },
        }
      );
      if (theOutfit.matchedCount == 0 || theOutfit.modifiedCount == 0)
        throw "Error: Failed to add like to User document";
      status = '<i class="fa-solid fa-heart"></i>';
    }
    const updatedOutfit = await outfitsCollection.findOne({ _id: id });
    if (!updatedOutfit) throw "Error: Failed to get updated Outfit";
    return {
      result: "success",
      likes: updatedOutfit.likes.length,
      icon: status,
    };
  },
  async saveOutfit(id, user) {
    id = ObjectId(validation.checkId(id));
    user = validation.checkUsername(user);

    const usersCollection = await users();
    const userDoc = await usersCollection.findOne({ username: user });
    if (!userDoc) throw "Error: User does not exist";
    const outfitsCollection = await outfits();
    let isSaved = false;
    let status = "";
    userDoc.userSaves.forEach((outfit) => {
      if (outfit.toString() == id.toString()) {
        isSaved = true;
      }
    });
    if (isSaved) {
      // unlike the outfit
      const removeLike = await usersCollection.updateOne(
        { username: user },
        {
          $pull: { userSaves: id },
        }
      );
      if (removeLike.matchedCount == 0 || removeLike.modifiedCount == 0)
        throw "Error: Failed to remove save from User document";

      const theOutfit = await outfitsCollection.updateOne(
        { _id: id },
        {
          $pull: { saves: userDoc._id },
        }
      );
      if (theOutfit.matchedCount == 0 || theOutfit.modifiedCount == 0)
        throw "Error: Failed to remove save from User document";
      status = '<i class="fa-regular fa-bookmark"></i>';
    } else {
      // like the outfit
      const removeLike = await usersCollection.updateOne(
        { username: user },
        {
          $push: { userSaves: id },
        }
      );
      if (removeLike.matchedCount == 0 || removeLike.modifiedCount == 0)
        throw "Error: Failed to add save to User document";

      const theOutfit = await outfitsCollection.updateOne(
        { _id: id },
        {
          $push: { saves: userDoc._id },
        }
      );
      if (theOutfit.matchedCount == 0 || theOutfit.modifiedCount == 0)
        throw "Error: Failed to add save to User document";
      status = '<i class="fa-solid fa-bookmark"></i>';
    }
    const updatedOutfit = await outfitsCollection.findOne({ _id: id });
    if (!updatedOutfit) throw "Error: Failed to get updated Outfit";
    return { result: "success", icon: status };
  },

  async getUserLikedOutfits(user) {
    user = outfitValidation.checkUsername(user);
    const usersCollection = await users();
    const userDoc = await usersCollection.findOne({ username: user });
    if (!userDoc) throw "Error: Could not find User document";
    const outfitsCollection = await outfits();
    const outfitLikes = [];
    for (const likeId of userDoc.userLikes) {
      const outfitData = await outfitsCollection.findOne({ _id: likeId });
      if (!outfitData) throw "Error: Could not find Outfit document";
      outfitLikes.push(outfitData);
    }
    if (outfitLikes) {
      for (let outfit of outfitLikes) {
        outfit["clothingData"] = [];
        for (let clothingId of outfit.clothes) {
          const clothingItem = await clothesData.getClothingItemById(
            clothingId.toString()
          );
          if (clothingItem) outfit["clothingData"].push(clothingItem);
          else throw "Error: Failed to find Clothing Item";
        }
      }
    }
    return outfitLikes;
  },
  async getUserSavedOutfits(user) {
    user = outfitValidation.checkUsername(user);
    const usersCollection = await users();
    const userDoc = await usersCollection.findOne({ username: user });
    if (!userDoc) throw "Error: Could not find User document";
    const outfitsCollection = await outfits();
    const outfitSaves = [];
    for (const saveId of userDoc.userSaves) {
      const outfitData = await outfitsCollection.findOne({ _id: saveId });
      if (!outfitData) throw "Error: Could not find Outfit document";
      outfitSaves.push(outfitData);
    }
    if (outfitSaves) {
      for (let outfit of outfitSaves) {
        outfit["clothingData"] = [];
        for (let clothingId of outfit.clothes) {
          const clothingItem = await clothesData.getClothingItemById(
            clothingId.toString()
          );
          if (clothingItem) outfit["clothingData"].push(clothingItem);
          else throw "Error: Failed to find Clothing Item";
        }
      }
    }
    return outfitSaves;
  },
  async addOutfitToCalendar(id, date) {
    id = outfitValidation.checkId(id);
    if (!id || !id.trim()) throw "Error: Outfit id is empty";
    if (!ObjectId.isValid(id)) throw "Error: Outfit id is not valid";
    id = ObjectId(id);

    if (!moment(date, "MM-DD-YYYY", true).isValid()) {
      throw `Cannot log invalid date ${date}`;
    }

    const outfitsCollection = await outfits();

    let outfit = await outfitsCollection.findOne({ _id: id });

    if (!outfit) throw `Error: Could not find outfit with id`;

    let creator = outfit.creator;

    if (!creator) throw `Error: undefined creator name`;

    const accountCollection = await users();

    let account = await accountCollection.findOne({ username: creator });

    if (!account) throw `Error: Could not find account with username`;

    let newCalendar = account.calendar;

    if (newCalendar == null || !newCalendar) {
      newCalendar = {};
    }

    //add id to calendar date
    if (!newCalendar[date]) {
      newCalendar[date] = [id];
    } else {
      if (!newCalendar[date].every((outfit) => outfit.toString() != id)) {
        throw `Error: Outfit already added to calendar on ${date}`;
      }
      newCalendar[date].push(id);
    }

    let outfitsCounter = account.statistics.outfitsWorn;
    if (outfitsCounter == null || !outfitsCounter) {
      outfitsCounter = {};
    }

    if (!outfitsCounter[id.toString()]) {
      outfitsCounter[id.toString()] = 1;
    } else {
      outfitsCounter[id.toString()]++;
    }

    let accountUpdate = await accountCollection.updateOne(
      { username: creator },
      {
        $set: { calendar: newCalendar },
      }
    );
    accountUpdate = await accountCollection.updateOne(
      { username: creator },
      {
        $set: { "statistics.outfitsWorn": outfitsCounter },
      }
    );

    let clothes = outfit.clothes;

    if (clothes == null || !clothes) {
      clothes = [];
    }

    let clothesCounter = account.statistics.clothesWorn;
    if (clothesCounter == null || !clothesCounter) {
      clothesCounter = {};
    }

    for (let i = 0; i < clothes.length; i++) {
      clothes_id = clothes[i];

      if (!clothesCounter[clothes_id.toString()]) {
        clothesCounter[clothes_id.toString()] = 1;
      } else {
        clothesCounter[clothes_id.toString()]++;
      }

      accountUpdate = await accountCollection.updateOne(
        { username: creator },
        {
          $set: { "statistics.clothesWorn": clothesCounter },
        }
      );
    }

    if (accountUpdate.matchedCount == 0 || accountUpdate.modifiedCount == 0) {
      throw "Error: Failed to add outfit to calendar";
    }

    account = await accountCollection.findOne({ username: creator });

    return { result: "success" };
  },

  async getOutfitsOnDate(username, date) {
    if (!username) throw `Error: Invalid username`;
    username = validation.checkUsername(username);
    if (!moment(date, "MM-DD-YYYY", true).isValid()) {
      throw `Cannot log invalid date ${date}`;
    }

    const accountCollection = await users();
    let account = await accountCollection.findOne({ username: username });

    if (!account) throw `Error: Could not find account with username`;

    let calendar = account.calendar[date];

    if (!calendar) {
      calendar = [];
    }

    const outfitsCollection = await outfits();

    let userOutfits = [];
    for (let i = 0; i < calendar.length; i++) {
      userOutfits.push(await outfitsCollection.findOne({ _id: calendar[i] }));
    }

    if (userOutfits) {
      for (let outfit of userOutfits) {
        outfit["clothingData"] = [];
        for (let clothingId of outfit.clothes) {
          const clothingItem = await clothesData.getClothingItemById(
            clothingId.toString()
          );
          if (clothingItem) outfit["clothingData"].push(clothingItem);
          else throw "Error: Failed to find Clothing Item";
        }
      }
    } else {
      throw `Error: Failed to load outfits on ${date}`;
    }
    return userOutfits;
  },
  async getOutfitbyIds(ids) {
    ids = outfitValidation.checkOutfitIds(ids);
    let outfitItems = [];
    const outfitsCollection = await outfits();
    for (let i = 0; i < ids.length; i++) {
      let outfitsDocument = await outfitsCollection.findOne({ _id: ids[i] });
      if (outfitsDocument) outfitItems.push(outfitsDocument);
    }
    return outfitItems;
  },
};
