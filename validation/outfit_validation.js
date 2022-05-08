const { ObjectId } = require("mongodb");
const clothesValidation = require("./clothes_validation");
const accountValidation = require("./account_validation");
const xss = require('xss');

function errors_clothing(id, name) {
  if (!id || id == null) {
    throw `${name} is not initialized`;
  }

  if (!ObjectId.isValid(id)) throw `${name} must be a valid mongo id`;

  id = ObjectId(id);
  return xss(id);
}

function errors_clothes(lst, name) {
  if (!lst || lst == null) {
    throw `${name} is not initialized`;
  }

  return lst.map((a) => errors_clothing(xss(a)));
}

module.exports = {
  checkUsername(user) {
    return accountValidation.checkUsername(xss(user));
  },
  checkOutfitName(outfitName) {
    outfitName = outfitName.trim();
    return clothesValidation.checkTextInput(xss(outfitName), "Outfit Name");
  },
  checkStyles(styles) {
    return clothesValidation.checkListInput(xss(styles), "Styles Array");
  },
  checkStatus(status) {
    if (!status || typeof status !== "string")
      throw "Error: status must be provided as a string";
    status = status.trim();
    if (
      status.localeCompare("private") !== 0 &&
      status.localeCompare("public") !== 0
    )
      throw "Error: status must be public or private";
    return xss(status);
  },
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return xss(id);
  },
  checkSeasons(seasons) {
    return clothesValidation.checkCheckboxInput(xss(seasons), "seasons", [
      "winter",
      "spring",
      "summer",
      "fall",
    ]);
  },
  checkImages(images) {
    images = clothesValidation.checkListInput(xss(images), "Images Array");
    if (images.length < 2) throw "Error: not enough clothes to make outfit";
    return xss(images);
  },
  checkIdArrays(ids) {
    if (ids.length < 2) {
      throw "Error: 2 clothing items are need to create an outfit";
    }
    return errors_clothes(xss(ids), "Id Array");
  },
  checkOutfitIds(ids) {
    return errors_clothes(xss(ids), "Outfit ids");
  },
};
