const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
//const { use } = require("../routes/account");
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const isAlphanumeric = require("is-alphanumeric");
const validation = require('../validation');


module.exports = {

    //change username
    async changeUsername(original,username) {
        //check id 
        //see lab6 

        username = validation.checkUsername(username);
        //id=validation.checkId(id);
        original = validation.checkUsername(original);
        const userCollection = await users();
        //get the user
        const user = await userCollection.findOne({
            username: { $regex: "^" + original + "$", $options: "i" },
          });

        if(!user){
            throw "invalid username";
        }

        if(!user.bio){
            user.bio = null;
        }
        if(!user.stores){
            user.stores =null;
        }


        const user2 = await userCollection.findOne({
            username: { $regex: "^" + username + "$", $options: "i" },
          });

        if(user2){
            throw "Error: username taken";
        }

        let updateUser = {
            username: username,
            hashedPassword: user.hashedPassword,
            userClothes: user.userClothes,
            userOutfits: user.userOutfits,
            userLikes: user.userLikes,
            userSaves: user.userSaves,
            statistics: {
                type: {
                    tops: user.statistics.type.tops,
                    bottoms: user.statistics.type.bottoms,
                    dresses: user.statistics.type.dresses,
                    shoes: user.statistics.type.shoes,
                    accessories: user.statistics.type.accessories,
                    outerwear: user.statistics.type.outerwear,
                    socks: user.statistics.type.socks,
                },
                //need to call something like user.statistics.colors-patterns
                "colors-patterns": user.statistics["color-patterns"],
                brands: user.statistics.brands,
            },
            calendar: user.calendar,
            bio:user.bio,
            stores:user.stores
        };

        const updatedInfo = await userCollection.updateOne(
            { username: original },
            { $set: updateUser }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw 'Make sure your username is different from the previous one';
        };

     const modifieduser = await userCollection.findOne({
        username: { $regex: "^" + username + "$", $options: "i" },
      });

        modifieduser._id = modifieduser._id.toString();
        return modifieduser;
    },

    //change password

    async changePassword(username, password) {
        //check id 
        //see lab6 
        
        username=validation.checkUsername(username);
        password = validation.checkPassword(password);
        const userCollection = await users();
        //id=validation.checkId(id);

        const user = await userCollection.findOne({
            username: { $regex: "^" + username + "$", $options: "i" },
          });

        let hashedPassword = await bcrypt.hash(password, 10);
        if(!user){
            throw "invalid username";
        }
        if(!user.bio){
            user.bio = null;
        }
        if(!user.stores){
            user.stores =null;
        }


        let updateUser = {
            username: user.username,
            hashedPassword: hashedPassword,
            userClothes: user.userClothes,
            userOutfits: user.userOutfits,
            userLikes: user.userLikes,
            userSaves: user.userSaves,
            statistics: {
                type: {
                    tops: user.statistics.type.tops,
                    bottoms: user.statistics.type.bottoms,
                    dresses: user.statistics.type.dresses,
                    shoes: user.statistics.type.shoes,
                    accessories: user.statistics.type.accessories,
                    outerwear: user.statistics.type.outerwear,
                    socks: user.statistics.type.socks,
                },
                //need to call something like user.statistics.colors-patterns
                "colors-patterns": user.statistics["color-patterns"],
                brands: user.statistics.brands,
            },
            calendar: user.calendar,
            bio:user.bio,
            stores:user.stores
        };

        const updatedInfo = await userCollection.updateOne(
            { username: username },
            { $set: updateUser }
        );
        const modifieduser = await userCollection.findOne({
            username: { $regex: "^" + username + "$", $options: "i" },
          });
          
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update user successfully';
        };
        modifieduser._id = modifieduser._id.toString();
        return modifieduser;

    },


    //change bio

    async changeBio(username, bio) {
        //check id 
        //see lab6 

        bio = validation.checkString(bio);
        username=validation.checkUsername(username);
        const userCollection = await users();

        const user = await userCollection.findOne({
            username: { $regex: "^" + username + "$", $options: "i" },
          });

        if(!user){
            throw "no user found";
        }

        if(!user.stores){
            user.stores =null;
        }

        let updateUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            userClothes: user.userClothes,
            userOutfits: user.userOutfits,
            userLikes: user.userLikes,
            userSaves: user.userSaves,
            statistics: {
                type: {
                    tops: user.statistics.type.tops,
                    bottoms: user.statistics.type.bottoms,
                    dresses: user.statistics.type.dresses,
                    shoes: user.statistics.type.shoes,
                    accessories: user.statistics.type.accessories,
                    outerwear: user.statistics.type.outerwear,
                    socks: user.statistics.type.socks,
                },
                //need to call something like user.statistics.colors-patterns
                "colors-patterns": user.statistics["color-patterns"],
                brands: user.statistics.brands,
            },
            calendar: user.calendar,
            stores:user.stores,
            bio:bio
            //favstores
            //bio
        };

        const updatedInfo = await userCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updateUser }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update user successfully';
        };

        const modifieduser = await this.get(id);
        modifieduser._id = id.toString();
        return modifieduser;

    },


    //add a favorite store 

    async changestore(username, storename, storelink) {
        //check id 
        //see lab6 

        store = validation.checkString(storename);
        website = validation.checkWebsite(storelink);
        username=validation.checkUsername(username);
        const userCollection = await users();

        const user = await userCollection.findOne({
            username: { $regex: "^" + username + "$", $options: "i" },
          });

        
        if(!user){
            throw "invalid Id";
        }

        if(!user.bio){
            user.bio = "N/A"
        }

        //deal with new store
        let newstore = {
            name: store,
            website:website
        }

        //if no user liked store
        if(!user.stores){
            //create new array
            user.stores =[]; 
        }
        user.stores.push(newstore);


        let updateUser = {
            username: username,
            hashedPassword: user.hashedPassword,
            userClothes: user.userClothes,
            userOutfits: user.userOutfits,
            userLikes: user.userLikes,
            userSaves: user.userSaves,
            statistics: {
                type: {
                    tops: user.statistics.type.tops,
                    bottoms: user.statistics.type.bottoms,
                    dresses: user.statistics.type.dresses,
                    shoes: user.statistics.type.shoes,
                    accessories: user.statistics.type.accessories,
                    outerwear: user.statistics.type.outerwear,
                    socks: user.statistics.type.socks,
                },
                //need to call something like user.statistics.colors-patterns
                "colors-patterns": user.statistics["color-patterns"],
                brands: user.statistics.brands,
            },
            calendar: user.calendar,
            bio:user.bio,
            stores:user.stores
        };

        const updatedInfo = await userCollection.updateOne(
            { username: username },
            { $set: updateUser }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update user successfully';
        };

        const modifieduser = await this.get(id);
        modifieduser._id = id.toString();
        return modifieduser;

    }


};