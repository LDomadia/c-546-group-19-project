//update to whatever functions we need
const gen_outfitData = require("./gen_outfit");
const commentsData = require("./comments");
const clothesData = require("./clothes");
const outfitsData = require("./outfits");
const accountData = require("./account");
const detailedData = require("./detailed");

module.exports = {
  //export list
  gen_outfit: gen_outfitData,
  comments: commentsData,
  clothes: clothesData,
  outfits: outfitsData,
  account: accountData,
  detailed:detailedData
};
