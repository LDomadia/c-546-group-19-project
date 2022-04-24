const mongoCollections = require("../config/mongoCollections");
const clothes = mongoCollections.clothes;
const users = mongoCollections.users;
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
  async addNewClothes(name, image, type, colorPatterns, season, style, brand, user) {
    if (!name.trim()) throw 'Error: Clothing Name is required';
    if (!image.trim()) throw 'Error: Image is required';
    if (!type.trim() || type.trim() == 'null') throw 'Error: Type is required';

    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({username: user});
    let stats = userDocument.statistics;

    if (type == 'Top') stats.type.tops += 1;
    else if (type == 'Bottom') stats.type.bottoms += 1;
    else if (type == 'Dress') stats.type.dresses += 1;
    else if (type == 'Shoes') stats.type.shoes += 1;
    else if (type == 'Accessory') stats.type.accessories += 1;
    else if (type == 'Outerwear') stats.type.outerwear += 1;
    else if (type == 'Socks') stats.type.socks += 1;

    if (style) {
      style.forEach(element => {
        element = element.trim().toLowerCase();
      })
    }

    if (colorPatterns) {
      colorPatterns.forEach(element => {
        element = element.trim().toLowerCase();
        if (stats['colors-patterns'][element]) 
          stats['colors-patterns'][element] += 1;
        else 
          stats['colors-patterns'][element] = 1
      });
    }

    if (brand) {
      brand = brand.trim().toLowerCase();
    if (stats['brands'][brand]) 
      stats['brands'][brand] += 1;
    else 
      stats['brands'][brand] = 1;
    }

    const clothesCollection = await clothes();

    let newClothes = {
      image: image,
      name: name,
      type: type,
      "colors-patterns": colorPatterns,
      season: season,
      style: style,
      brand: brand
    };

    const insertInfo = await clothesCollection.insertOne(newClothes);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Error: Failed to add new Clothing Item";
  
    const updateInfo = await usersCollection.updateOne({username: user}, {
      $push: {
        userClothes: insertInfo.insertedId
      },
      $set: {
        statistics: stats
      }
    });

    if (updateInfo.matchedCount == 0 || updateInfo.modifiedCount == 0) 
      throw 'Error: Failed to update user';
    
    return 'success';
  }
};