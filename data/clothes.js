// const mongoCollections = require("../config/mongoCollections");
// const clothes = mongoCollections.clothes;
// const users = mongoCollections.users;
const validate = require("../validation/clothes_validation");
const { ObjectId } = require("mongodb");
const { clothes, outfits, users } = require("../config/mongoCollections");

module.exports = {
  async addNewClothingItem(
    name,
    image,
    type,
    size,
    colorPatterns,
    seasons,
    styles,
    brand,
    user
  ) {
    name = validate.checkTextInput(name, "Clothing Name");
    image = validate.checkFileInput(image, "Image");
    type = validate.checkSelectInput(type, "Type", [
      "top",
      "bottom",
      "dress",
      "shoes",
      "accessory",
      "outerwear",
      "socks",
    ]);
    if (size) size = validate.checkTextInput(size, "Size");
    if (!colorPatterns) colorPatterns = [];
    colorPatterns = validate.checkListInput(colorPatterns, "Colors/Patterns");
    if (!seasons) seasons = [];
    seasons = validate.checkCheckboxInput(seasons, "seasons", [
      "winter",
      "spring",
      "summer",
      "fall",
    ]);
    if (!styles) styles = [];
    styles = validate.checkListInput(styles, "Styles");
    if (brand) brand = validate.checkTextInput(brand, "Brand");

    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({ username: user });
    if (!userDocument) throw "Error: User does not exists";
    let stats = userDocument.statistics;

    if (type == "top") stats.type.tops += 1;
    else if (type == "bottom") stats.type.bottoms += 1;
    else if (type == "dress") stats.type.dresses += 1;
    else if (type == "shoes") stats.type.shoes += 1;
    else if (type == "accessory") stats.type.accessories += 1;
    else if (type == "outerwear") stats.type.outerwear += 1;
    else if (type == "socks") stats.type.socks += 1;

    if (colorPatterns) {
      colorPatterns.forEach((element) => {
        if (stats["colors-patterns"][element])
          stats["colors-patterns"][element] += 1;
        else stats["colors-patterns"][element] = 1;
      });
    }

    if (brand) {
      brand = brand.trim().toLowerCase();
      if (stats["brands"][brand]) stats["brands"][brand] += 1;
      else stats["brands"][brand] = 1;
    }

    let newClothes = {
      image: image,
      name: name,
      type: type,
      size: size,
      "colors-patterns": colorPatterns,
      season: seasons,
      style: styles,
      brand: brand,
    };

    const clothesCollection = await clothes();
    const insertInfo = await clothesCollection.insertOne(newClothes);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Error: Failed to add new Clothing Item";

    const updateInfo = await usersCollection.updateOne(
      { username: user },
      {
        $push: {
          userClothes: insertInfo.insertedId,
        },
        $set: {
          statistics: stats,
        },
      }
    );

    if (updateInfo.matchedCount == 0 || updateInfo.modifiedCount == 0)
      throw "Error: Failed to update User";
    return { result: "success", id: insertInfo.insertedId };
  },
  async getClothingItems(user) {
    let clothingItems = [];
    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({ username: user });
    if (userDocument) {
      const clothesCollection = await clothes();
      for (let id of userDocument.userClothes) {
        let clothesDocument = await clothesCollection.findOne({ _id: id });
        if (clothesDocument) clothingItems.push(clothesDocument);
        else throw "Error: Clothing item could not be found";
      }
    } else {
      throw "Error: User could not be found";
    }
    return clothingItems;
  },
  async getClothingbyIds(ids) {
    //TODO validate array
    if(!ids.every(id => ObjectId.isValid(id))){
      throw "Error: clothes ids contains invalid id"
    }
    let clothingItems = [];
    const clothesCollection = await clothes();
    for (let i = 0; i < ids.length; i++) {
      let clothesDocument = await clothesCollection.findOne({ _id: ids[i] });
      if (clothesDocument) clothingItems.push(clothesDocument);
    }
    return clothingItems;
  },
  async getClothingItemById(id) {
    if (!ObjectId.isValid(id)) throw 'Error: Clothing Item id is not valid';
    id = ObjectId(id);
    const clothesCollection = await clothes();
    const clothingItem = await clothesCollection.findOne({ _id: id });
    if (clothingItem) return clothingItem;
    else throw "Error: Clothing Item cannot be found";
  },
  async updateClothingItem(
    id,
    name,
    image,
    type,
    size,
    colorPatterns,
    seasons,
    styles,
    brand,
    user
  ) {
    if (!ObjectId.isValid(id)) throw "Error: Clothing Item id is not valid";
    id = ObjectId(id);
    name = validate.checkTextInput(name, "Clothing Name");
    if (image) image = validate.checkFileInput(image, "Image");
    type = validate.checkSelectInput(type, "Type", [
      "top",
      "bottom",
      "dress",
      "shoes",
      "accessory",
      "outerwear",
      "socks",
    ]);
    if (size) size = validate.checkTextInput(size, "Size");
    if (!colorPatterns) colorPatterns = [];
    colorPatterns = validate.checkListInput(colorPatterns, "Colors/Patterns");
    if (!seasons) seasons = [];
    seasons = validate.checkCheckboxInput(seasons, "seasons", [
      "winter",
      "spring",
      "summer",
      "fall",
    ]);
    if (!styles) styles = [];
    styles = validate.checkListInput(styles, "Styles");
    if (brand) brand = validate.checkTextInput(brand, "Brand");

    const clothesCollection = await clothes();
    const oldClothing = await clothesCollection.findOne({ _id: id });
    if (!oldClothing) throw "Error: Clothing Item does not exists";

    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({ username: user });
    if (!userDocument) throw "Error: User does not exists";
    let stats = userDocument.statistics;

    if (oldClothing.type !== type) {
      if (oldClothing.type == "top") stats.type.tops -= 1;
      else if (oldClothing.type == "bottom") stats.type.bottoms -= 1;
      else if (oldClothing.type == "dress") stats.type.dresses -= 1;
      else if (oldClothing.type == "shoes") stats.type.shoes -= 1;
      else if (oldClothing.type == "accessory") stats.type.accessories -= 1;
      else if (oldClothing.type == "outerwear") stats.type.outerwear -= 1;
      else if (oldClothing.type == "socks") stats.type.socks -= 1;

      if (type == "top") stats.type.tops += 1;
      else if (type == "bottom") stats.type.bottoms += 1;
      else if (type == "dress") stats.type.dresses += 1;
      else if (type == "shoes") stats.type.shoes += 1;
      else if (type == "accessory") stats.type.accessories += 1;
      else if (type == "outerwear") stats.type.outerwear += 1;
      else if (type == "socks") stats.type.socks += 1;
    }

    oldClothing["colors-patterns"].forEach((element) => {
      if (!colorPatterns || !colorPatterns.includes(element)) {
        stats["colors-patterns"][element] -= 1;
        if (stats["colors-patterns"][element] == 0)
          delete stats["colors-patterns"][element];
      }
    });
    if (colorPatterns) {
      colorPatterns.forEach(element => {
        element = element.trim().toLowerCase();
        if (!oldClothing['colors-patterns'].includes(element)) {
          if (stats['colors-patterns'][element]) 
            stats['colors-patterns'][element] += 1;
          else 
            stats['colors-patterns'][element] = 1;
        }
      });
    }

    if (oldClothing.brand != brand.trim().toLowerCase()) {
      if (oldClothing.brand) {
        stats['brands'][oldClothing.brand] -= 1;
        if (stats['brands'][oldClothing.brand] == 0) delete stats['brands'][oldClothing.brand];
      }
      if (brand) {
        brand = brand.trim().toLowerCase();
        if (stats['brands'][brand]) 
          stats['brands'][brand] += 1;
        else 
          stats['brands'][brand] = 1;
      }
    }

    if (image) {
      const updateClothing = await clothesCollection.updateOne(
        { _id: id },
        {
          $set: {
            image: image,
            name: name,
            type: type,
            size: size,
            "colors-patterns": colorPatterns,
            season: seasons,
            style: styles,
            brand: brand,
          },
        }
      );
      if (updateClothing.matchedCount == 0 || updateClothing.modifiedCount == 0)
        throw "Error: Failed to update Clothing Item, no changes were made";
    } else {
      const updateClothing = await clothesCollection.updateOne(
        { _id: id },
        {
          $set: {
            name: name,
            type: type,
            size: size,
            "colors-patterns": colorPatterns,
            season: seasons,
            style: styles,
            brand: brand,
          },
        }
      );
      if (updateClothing.matchedCount == 0 || updateClothing.modifiedCount == 0)
        throw "Error: Failed to update Clothing Item";
    }

    const updateInfo = await usersCollection.updateOne(
      { username: user },
      {
        $set: {
          statistics: stats,
        },
      }
    );

    if (updateInfo.matchedCount == 0) throw "Error: Failed to find User";

    return { result: "success" };
  },
  async getClothingIdsByImages(imagesArr) {
    //add error checking for images arr
    const clothingCollection = await clothes();

    let clothesIdArr = await Promise.all(
      imagesArr.map(async (im) => {
        let item = await clothingCollection.findOne({
          image: im,
        });
        if (!item) throw "Error: could not find id with given image ${im}";
        return item._id;
      })
    );
    return clothesIdArr;
  },
  async deleteClothingItem(id, user) {
    if (!ObjectId.isValid(id)) throw "Error: Clothing Item id is not valid";
    id = ObjectId(id);
    const clothesCollection = await clothes();

    const clothingItem = await clothesCollection.findOne({ _id: id });
    if (!clothingItem) {
      throw 'Error: Failed to find Clothing Item';
    }
    
    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({ username: user });
    if (!userDocument) throw "Error: User does not exists";
    let stats = userDocument.statistics;

    if (clothingItem.type == "top") stats.type.tops -= 1;
    else if (clothingItem.type == "bottom") stats.type.bottoms -= 1;
    else if (clothingItem.type == "dress") stats.type.dresses -= 1;
    else if (clothingItem.type == "shoes") stats.type.shoes -= 1;
    else if (clothingItem.type == "accessory") stats.type.accessories -= 1;
    else if (clothingItem.type == "outerwear") stats.type.outerwear -= 1;
    else if (clothingItem.type == "socks") stats.type.socks -= 1;

    if (clothingItem["colors-patterns"]) {
      clothingItem["colors-patterns"].forEach((element) => {
        if (stats["colors-patterns"][element])
          stats["colors-patterns"][element] -= 1;
        if (stats["colors-patterns"][element] == 0)
          delete stats["colors-patterns"][element];
      });
    }

    if (clothingItem.brand) {
      if (stats["brands"][clothingItem.brand]) 
        stats["brands"][clothingItem.brand] -= 1;
      if (stats["brands"][clothingItem.brand] == 0) 
        delete stats["brands"][clothingItem.brand];
    }

    const deleteClothingItem = await clothesCollection.deleteOne({ _id: id });
    if (!deleteClothingItem.acknowledged || deleteClothingItem.deletedCount == 0) {
      throw 'Error: Failed to delete Clothing Item';
    }

    const userUpdate = await usersCollection.updateOne({ username: user }, {
      $pull: { userClothes: id }, 
      $set: { statistics: stats }
    })
    if (userUpdate.matchedCount == 0 || userUpdate.modifiedCount == 0) {
      throw "Error: Failed to delete Clothing Item from User";
    }

    const outfitsCollection = await outfits();
    const outfitUpdates = await outfitsCollection.updateMany({ clothes: id }, {
      $pull: { clothes: id }
    })
    if (outfitUpdates.matchedCount != outfitUpdates.modifiedCount) {
      throw 'Error: Failed to delete Clothing Item from Outfits';
    }

    return { result: 'success' };
  }
};
