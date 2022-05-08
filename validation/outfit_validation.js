const { ObjectId } = require("mongodb");
const sanitizer = require('sanitizer');
const clothesValidation = require("./clothes_validation");
const accountValidation = require("./account_validation");

function errors_clothing(id, name) {
  if (!id || id == null) {
    throw `${name} is not initialized`;
  }

  if (!ObjectId.isValid(id)) throw `${name} must be a valid mongo id`;

  id = ObjectId(id);
  return id;
}

function errors_clothes(lst, name) {
  if (!lst || lst == null) {
    throw `${name} is not initialized`;
  }

  return lst.map((a) => errors_clothing(a));
}

module.exports = {
  checkUsername(user) {
    return accountValidation.checkUsername(user);
  },
  checkOutfitName(outfitName) {
    outfitName = outfitName.trim();
    return clothesValidation.checkTextInput(outfitName, "Outfit Name");
  },
  checkStyles(styles) {
    return clothesValidation.checkListInput(styles, "Styles Array");
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
    return status;
  },
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    id = sanitizer.sanitize(id)
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    strVal = sanitizer.sanitize(strVal)
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    let arrayInvalidFlag = false;
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        arrayInvalidFlag = true;
        break;
      }
      arr[i] = arr[i].trim();
      arr[i] = sanitizer.sanitize(arr[i])
  checkSeasons(seasons) {
    return clothesValidation.checkCheckboxInput(seasons, "seasons", [
      "winter",
      "spring",
      "summer",
      "fall",
    ]);
  },
  checkImages(images) {
    images = clothesValidation.checkListInput(images, "Images Array");
    if (images.length < 2) throw "Error: not enough clothes to make outfit";
    return images;
  },
  checkIdArrays(ids) {
    if (ids.length < 2) {
      throw "Error: 2 clothing items are need to create an outfit";
    }
    return errors_clothes(ids, "Id Array");
  },
  checkOutfitIds(ids) {
    return errors_clothes(ids, "Outfit ids");
  },
};
