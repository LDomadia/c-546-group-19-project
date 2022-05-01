const mongoCollections = require("../config/mongoCollections");
const outfits = mongoCollections.outfits;
const { ObjectId } = require("mongodb");

const errors_string = function(str, name){

  if(!str){
      throw `${name} is not initialized`
  }

  if(typeof(str) !== "string"){
      throw `${name} must be type string`
  }

  str = str.trim()

  if(str.length < 1){
      throw `${name} cannot be an empty string`
  }

  return str
  
}

const errors_strlist = function(lst, name){
  if(!lst){
      throw `${name} is not initialized`
  }

  if(lst.length < 1){
      throw `${name} cannot be empty list`
  }

  return lst.map(a => errors_string(a))
}

module.exports = {
  async addNewOutfits(creator, status, outfitName, season, style) {
    let err = function(str){return `Error: ${str} was not provided`}
    let arg_names = ["creator", "status", "outfitName", "season", "style"]
    for(let i = 0; i < arg_names.length; i++){
      if(!arguments[i]){
        throw err(arg_names[i])
      }
    }

    creator = errors_string(creator, "creator")
    status = errors_string(status, "status")
    outfitName = errors_string(outfitName, "outfitName")

    season = errors_strlist(season, "season");
    style = errors_strlist(style, "style");

    const outfitsCollection = await outfits();
    const existingOutfits = await outfitsCollection.findOne({
      outfitName: { $regex: "^" + outfitName + "$", $options: "i" },
    });
    if (existingOutfits != null) throw "Error: name is already taken";

    let newOutfits = {
        creator: creator,
        likes: 0,
        status: status,
        outfitName: outfitName,
        season: season,
        style: style,
        clothes: [],
        comments: []
    };
    const insertInfo = await outfitsCollection.insertOne(newOutfits);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add outfit";

    const newId = insertInfo.insertedId.toString();
    return newId;
  },

  async addClothesToOutfit(outfit_id, cloth_ids) {

    outfit_id = errors_string(outfit_id, "outfit_id")
    cloth_ids = errors_strlist(cloth_ids, "cloth_ids")

    if (cloth_ids.map(id => (!ObjectId.isValid(id))).indexOf(true)>0){
        throw 'invalid cloth id found'
    }

    const outfitsCollection = await outfits();

    let outfit = await outfitsCollection.findOne({"_id": ObjectId(outfit_id)})

    let new_outfit_data =
    {
        clothes: cloth_ids
    }

    delete outfit._id

    outfit = Object.assign(outfit, new_outfit_data)

    const updated_info = await outfitsCollection.updateOne(
        { _id: ObjectId(outfit_id) },
        { $set: outfit }
      );

    if (updated_info.modifiedCount === 0) {
        throw 'Could not update outfit successfully';
    }

    return outfit_id;



  }

};