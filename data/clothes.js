const mongoCollections = require("../config/mongoCollections");
const clothes = mongoCollections.clothes;
const { ObjectId } = require("mongodb");

const errors_string = function(str, name){

  if(!str){
      throw `${name} is not initialized`
  }

  if(typeof(str) !== "string"){
      throw `${name} should be a string`
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
  async addNewClothes(name, image, type, color, season, style, brand) {
    let err = function(str){return `Error: ${str} was not provided`}
    let arg_names = ["name", "image", "type", "color", "season", "style", "brand"]
    for(let i = 0; i < arg_names.length; i++){
      if(!arguments[i]){
        throw err(arg_names[i])
      }
    }

    name = errors_string(name, "name")
    type = errors_string(type, "name")

    if (typeof image !== "object")
      throw "Error: image should be an object";

    color = errors_strlist(color, "color");
    season = errors_strlist(season, "season");
    style = errors_strlist(style, "style");

    brand = errors_string(brand, "brand")

    const clothesCollection = await clothes();
    const existingClothes = await clothesCollection.findOne({
      name: { $regex: "^" + name + "$", $options: "i" },
    });
    if (existingClothes != null) throw "Error: Clothing Name is already exists in your closet";

    let newClothes = {
      image: {"invalid": "not implemented"},
      name: name,
      type: type,
      color: color,
      season: season,
      style: style,
      brand: brand
    };
    const insertInfo = await clothesCollection.insertOne(newClothes);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add clothes";

    const newId = insertInfo.insertedId.toString();
    return newId;
  }
};