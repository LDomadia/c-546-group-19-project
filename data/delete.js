const { ObjectId } = require("mongodb");
const clothesdata = require("../data/clothes");
const outfitsdata = require("../data/outfits");
//const { use } = require("../routes/account");
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const isAlphanumeric = require("is-alphanumeric");
const validation = require('../validation/account_validation');
const { clothes, outfits, users } = require("../config/mongoCollections");


module.exports = {
    //remove account from user data
    async removeAccount(username) {
        username = validation.checkUsername(username);
        const userCollection = await users();

        const deletionInfo = await userCollection.deleteOne({
            username: { $regex: "^" + username + "$", $options: "i" },
        });


        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with username of ${username}`;
        }
        return { deleted: true };

    },



    // deleting all user clothes from clothes collection
    async deleteUserClothes(username) {

        username = validation.checkUsername(username);
        const userCollection = await users();

        const user = await userCollection.findOne({
            username: { $regex: "^" + username + "$", $options: "i" },
        });
        if (!user) throw "Either the username or password is invalid";
        if (!user.userClothes) throw "no clothes found"

        //returns an array
        const clothes = user.userClothes;

        for (let i = 0; i < clothes.length; i++) {
            //delete each clothing item from clothing collection
            validation.checkId(clothes[i].toString());    
            await clothesdata.deleteClothingItem(clothes[i].toString(), username);
        }

        return { deleted: true };
    },

    //delete from outfit collection
    async deleteUserOutfits(username) {

        //find all outfits with the given username and perform delete 
        username = validation.checkUsername(username);

        const outfitsCollection = await outfits();
        if (!outfitsCollection) throw "Error: could not retrieve outfits";
        //remove all outfits with given user
        const deletionInfo = await outfitsCollection.deleteMany({
            creator: username,
        });

        if (!deletionInfo) {
            throw `Could not delete outfits with given username`;
        }
        return { deleted: true };
    }
}

