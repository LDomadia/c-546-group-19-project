const mongoCollections = require('../config/mongoCollections');
const closets = mongoCollections.closets;
const { ObjectId } = require('mongodb');

const intialized = function intialized(val){
    return val!==undefined;
}

const errors_string = function(str, name){

    if(!intialized(str)){
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

const errors_args = function(req, arglen){
    if(arglen > req){
        throw `Too many arguments passed, max args allowed ${req}, given ${arglen}`
    }
}

async function create(name, item){
    //DONE
    errors_args(2, arguments.length)
    let closet_args = [name, item]

    //check if all args are intialized
    if(!closet_args.every(arg => intialized(arg))){
        throw "All fields need to have valid values"
    }

    name = errors_string(name, "name")
    item = errors_string(item, "item")

    const closetCollection = await closets();

    let newCloset = {
        name: name,
        item: item,
    }

    const insertInfo = await closetCollection.insertOne(newCloset);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add band';

    const newId = insertInfo.insertedId.toString();

    const getCloset = await closetCollection.findOne({ _id: ObjectId(newId) });

    return getCloset;

}



module.exports = {
    intialized,
    create
}