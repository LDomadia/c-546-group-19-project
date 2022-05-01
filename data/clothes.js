const mongoCollections = require("../config/mongoCollections");
const clothes = mongoCollections.clothes;
const users = mongoCollections.users;

module.exports = {
  async addNewClothes(name, image, type, colorPatterns, season, style, brand, user) {
    if (!name) throw 'Error: Clothing Name is required';
    if (!type) throw 'Error: Type is required';
    if (!image) throw 'Error: Image is required';
    if (!name.trim()) throw 'Error: Clothing Name is required';
    if (!type.trim() || type.trim() == 'null') throw 'Error: Type is required';

    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({username: user});
    if (!userDocument) throw 'Error: User does not exists';
    let stats = userDocument.statistics;

    if (type == 'Top') stats.type.tops += 1;
    else if (type == 'Bottom') stats.type.bottoms += 1;
    else if (type == 'Dress') stats.type.dresses += 1;
    else if (type == 'Shoes') stats.type.shoes += 1;
    else if (type == 'Accessory') stats.type.accessories += 1;
    else if (type == 'Outerwear') stats.type.outerwear += 1;
    else if (type == 'Socks') stats.type.socks += 1;

    if (style) {
      style = style.map(element => {
        return element.toLowerCase().trim();
      })
    }

    if (colorPatterns) {
      colorPatterns = colorPatterns.map(element => {
        return element.toLowerCase().trim();
      })
      colorPatterns.forEach(element => {
        if (stats['colors-patterns'][element]) 
          stats['colors-patterns'][element] += 1;
        else 
          stats['colors-patterns'][element] = 1;
      });
    }
    
    if (brand) {
      brand = brand.toLowerCase().trim();
    if (stats['brands'][brand]) 
      stats['brands'][brand] += 1;
    else 
      stats['brands'][brand] = 1;
    }

    if (!colorPatterns) {
      colorPatterns = [];
    }

    if (!style) {
      style = [];
    }

    let newClothes = {
      image: image,
      name: name,
      type: type,
      "colors-patterns": colorPatterns,
      season: season,
      style: style,
      brand: brand
    };

    const clothesCollection = await clothes();
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
  },
  async getClothingItems(user) {
    let clothingItems = [];
    const usersCollection = await users();
    const userDocument = await usersCollection.findOne({username: user});
    if (userDocument) {
      const clothesCollection = await clothes();
      for (let id of userDocument.userClothes) {
        let clothesDocument = await clothesCollection.findOne({_id: id});
        if (clothesDocument) clothingItems.push(clothesDocument);
      }
    }
    return clothingItems;
  }
};