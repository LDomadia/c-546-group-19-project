const connection = require('../config/mongoConnection');
const data = require('../data/');
const account = data.account;
const clothes = data.clothes;
const outfits = data.outfits;

const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    //users
    let user_info = {
        users : ["artistconfidence","giantdelighted","ollieomit","oraclelame","graduateaboard","venturetriangle","bobmajor","metalshipwreck","noisyhundred","pitysparkles"],
        pwds : ["pineapple124", "tower_1111", "bob2ross9", "dinosauce313", "nevergonnagiveyouup2", "129cake126", "elgato100", "328dm2e29E", "dE)(@K!dms9@-", "woein20!em"]
    }
    
    for(let i = 0; i < 10; i++){
        await account.addNewUser(user_info.users[i], user_info.pwds[i]); 
    }

    let clothes_info = {
        image: [{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"},{"invalid": "not implemented"}],
        name: ["Stripe Blazer", "GG Marmont mini top handle bag", "Nike Air Zoom Pegasus 38"],
        type: ["Blazer", "handbag", "sneakers"],
        color: [["Blue/White"], ["white", "silver"], ["black", "white"]],
        season: [["spring"], ["winter"], ["spring", "summer", "autumn", "winter"]],
        style: [["buisness"], ["casual"], ["sports", "casual"]],
        brand: ["Tommy Hilfiger", "Gucci", "Nike"]
    }

    for(let i = 0; i < 3; i++){
        await clothes.addNewClothes(clothes_info.name[i],
                                 clothes_info.image[i],
                                 clothes_info.type[i],
                                 clothes_info.color[i],
                                 clothes_info.season[i],
                                 clothes_info.style[i],
                                 clothes_info.brand[i]); 
    }

    let outfits_info = {
        creator: ["artistconfidence","giantdelighted","ollieomit","oraclelame","graduateaboard","venturetriangle","bobmajor","metalshipwreck","noisyhundred","pitysparkles"],
        status: ["private", "public", "private", "public", "public", "private", "public", "private", "public", "private"],
        outfitName: ["bingus drip", "Very Large Clothes", "just pokedots", "my awful design", "my good design", "my better design", "only hats", "buisness clothes", "spring vibe", "winter2022"],
        season: [["spring"], ["spring", "winter"], ["winter"], ["summer", "autumn"], ["spring", "winter"], ["winter"], ["spring"], ["summer", "winter", "spring"], ["winter"], ["spring"], ["winter"]],
        style: [["casual"], ["buisness"], ["culture", "casual"], ["casual"], ["uniform"], ["casual", "buisness"], ["party"], ["buisness", "party"], ["casual"], ["night time", "party"]]
    }

    for(let i = 0; i < 10; i++){
        await outfits.addNewOutfits(outfits_info.creator[i],
                                    outfits_info.status[i],
                                    outfits_info.outfitName[i],
                                    outfits_info.season[i],
                                    outfits_info.style[i])
    }



    console.log('Done seeding database');

    await connection.closeConnection();
}

main();