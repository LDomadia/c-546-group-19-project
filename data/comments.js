const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
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
  async addNewComment(commentor, text) {
    let err = function(str){return `Error: ${str} was not provided`}
    let arg_names = ["commentor", "text"]
    for(let i = 0; i < arg_names.length; i++){
      if(!arguments[i]){
        throw err(arg_names[i])
      }
    }

    commentor = errors_string(commentor, "commentor")
    text = errors_string(text, "text")

    const commentsCollection = await comments();

    let newComments = {
        commentor: commentor,
        text: text
    };
    const insertInfo = await commentsCollection.insertOne(newComments);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add outfit";

    const newId = insertInfo.insertedId.toString();
    return newId;
  }
};