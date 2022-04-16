//update to whatever functions we need
const commentsData = require("./comments");
const clothesData = require("./clothes");
const outfitsData = require("./outfits");
const accountData = require("./account");

module.exports = {
  //export list
  comments: commentsData,
  clothes: clothesData,
  outfits: outfitsData,
  account: accountData
};
