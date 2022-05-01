const mongoCollections = require("../config/mongoCollections");
const clothes = mongoCollections.clothes;

//handle string errors and trim
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
    if(!collection){
      throw "Error: Could not get clothes database"
    }
    let cloth_names = ["Top", "Bottom", "Dress", "Shoes", "Accessory", "Outerwear", "Socks"]
    cloth_type = errors_string(cloth_type, "cloth_type")
    if(cloth_names.indexOf(cloth_type)<0){
      throw "Error: invalid cloth type"
    }

    return await collection.find({
        type: { $regex: "^" + cloth_type + "$", $options: "i" },
      }).toArray()
}

//gives a score to how much a piece of cloth matches the preferences
function matchClothPreferences(prefs, cloth){
  let score = 0;
  let tags = Object.keys(prefs)
  //controls how much a tag affects the score
  let tags_control = [.9, .85, 1]

  //score calculated as: total similarities*control
  for(let i = 0; i < tags.length; i++){
    let sim = prefs[tags[i]].sort().filter(val => cloth[tags[i]].sort().includes(val)).length;
    score += sim*tags_control[i];
  }

  return {score: score, _id: cloth._id}

}

//generates outfit based on preferences input
//if similarites between each clothing piece match the preferences to a certain threshold, recommend the highest similarity
//returns an object with the ID of each best matching cloth, can return nothing for a certain piece/s
//assumption is pararmeters are all given (except optional threshold), and are valid based on the clothes db
async function generateOutfit(colorPatterns, season, style, threshold=1.5){
    //error handling
    let err = function(str){return `Error: ${str} was not provided`};
    let arg_names = ["colorPatterns", "season", "style"];
    for(let i = 0; i < arg_names.length; i++){
      if(!arguments[i]){
        throw err(arg_names[i]);
      }
    }
    colorPatterns = errors_strlist(colorPatterns)
    season = errors_strlist(season)
    style = errors_strlist(style)
    if(typeof(threshold) !== "number"){
      throw "Error: threshold must be a number"
    }
    
    //if threshold is less than zero, default to 0
    if(threshold<0){
      threshold = 0;
    }

    //get clothes db for each piece
    const clothesCollection = await clothes();

    let cloth_names = ["Top", "Bottom", "Dress", "Shoes", "Accessory", "Outerwear", "Socks"]
    let existingClothes = {}

    for(let i = 0; i < cloth_names.length; i++){
      existingClothes[cloth_names[i]] = await getClothType(clothesCollection, cloth_names[i])
    }

    const prefs = {
      "colors-patterns": colorPatterns,
      "season": season,
      "style": style
    }
    let scoreClothes = {}
    let bestClothes = {}
    let finalClothes = []
    let finalClothesindx = 0

    //finally get the scores of each type of clothing based on preferences and take the max
    for(let i = 0; i < cloth_names.length; i++){
      scoreClothes[cloth_names[i]] = existingClothes[cloth_names[i]].map(cloth => matchClothPreferences(prefs, cloth))
      bestClothes[cloth_names[i]] = scoreClothes[cloth_names[i]].reduce((scoreA, scoreB) => (scoreA.score>scoreB.score) ? scoreA : scoreB,-1)
      
      //replace outfits not found with empty score object
      if(bestClothes[cloth_names[i]] == -1){
        bestClothes[cloth_names[i]] = {score: -1, _id: ""}
      }
      
      //if threshold not met set to empty score object
      if(bestClothes[cloth_names[i]].score < threshold){
        bestClothes[cloth_names[i]] = undefined
      }
      //finally makes a frontend applicable list
      else{
        finalClothes[finalClothesindx] = bestClothes[cloth_names[i]]
        finalClothes[finalClothesindx]["cloth_name"] = cloth_names[i]
        finalClothesindx++
      }
    }

    return finalClothes
}


module.exports = {
    generateOutfit
}