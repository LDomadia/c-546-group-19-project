const mongoCollections = require("../config/mongoCollections");
const validation = require("../validation/outfits_validation");
const clothesData = require('../data/clothes');
const outfits = mongoCollections.outfits;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");



module.exports = {
    //export list
    //get (public) outfit by id
    async get_outfit_by_id(id) {
        //check id
        let outfit;

        const outfitsCollection = await outfits();
        if (outfitsCollection) {
            outfit = await outfitsCollection.findOne({ status: 'public', _id: ObjectId(id) });

            if (!outfit) {
                throw "no user found";
            }

            return outfit;

        }
        throw "error in getting outfits collection"
    }
};
