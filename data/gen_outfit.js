const mongoCollections = require("../config/mongoCollections");
const clothes = mongoCollections.clothes;

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


//gets all occurances of specific cloth type in clothes db
async function getClothType(collection, cloth_type){
    return await collection.find({
        type: { $regex: "^" + cloth_type + "$", $options: "i" },
      }).toArray()
}

//gives a score to how much a piece of cloth matches the preferences
function matchClothPreferences(prefs, cloth){

}

//generates outfit based on preferences input
//if similarites between each clothing piece match the preferences to a certain threshold, recommend the highest similarity
//returns an object with the ID of each best matching cloth, can return nothing for a certain piece/s
//assumption is pararmeters are all given (except optional threshold), and are valid based on the clothes db
async function generateOutfit(colorPatterns, season, style, threshold=3){
    //error handling
    let err = function(str){return `Error: ${str} was not provided`}
    let arg_names = ["colorPatterns", "season", "style"]
    for(let i = 0; i < arg_names.length; i++){
      if(!arguments[i]){
        throw err(arg_names[i])
      }
    }
    colorPatterns = errors_strlist(colorPatterns)
    season = errors_strlist(season)
    style = errors_strlist(style)

    //get clothes db for each piece
    const clothesCollection = await clothes();

    let cloth_names = ["Top", "Bottom", "Dress", "Shoes", "Accessory", "Outerwear", "Socks"]
    let existingClothes = {}

    for(let i = 0; i < cloth_names.length; i++){
      existingClothes[cloth_names[i]] = await getClothType(clothesCollection, cloth_names[i])
    }

    console.log(existingClothes["Top"])

    return 1

}

generateOutfit(["apple"], ["bees"], ["123"])

module.exports = {
    generateOutfit
}