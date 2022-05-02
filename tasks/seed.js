const connection = require('../config/mongoConnection');
const data = require('../data/');
const account = data.account;
const clothes = data.clothes;
const outfits = data.outfits;
const comments = data.comments;

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

    //clothes
    let clothes_info = {
        image: ["invalid", "invalid", "invalid", "invalid", "invalid", "invalid", "invalid", "invalid", "invalid", "invalid"],
        name: ["Stripe Blazer", "GG Marmont mini top handle bag", "Nike Air Zoom Pegasus 38", "Citrus Shoes", "Polarized Sunglasses, RB2132 NEW WAYFARER", "Juniors' Ripped 90s Wide Leg Jeans", "Men's RL Fleece Hoodie", "Men's Pony Print Sleep Joggers", "Women's Printed Leggings", "Printed Tie-Front Genie-Leg Jumpsuit"],
        type: ["Top", "Accessory", "Shoes", "Shoes", "Outerwear", "Bottom", "Top", "Bottom", "Bottom", "Bottom"],
        color: [["white", "blue"], ["white", "silver"], ["black", "white"], ["orange", "white"], ["black"], ["navy blue", "white"], ["light blue", "white"], ["red", "pink"], ["black", "white", "blue"], ["blue", "white"]],
        season: [["Spring"], ["Winter"], ["Winter", "Spring", "Summer", "Fall"], ["Summer"], ["Summer", "Spring"], ["Winter", "Spring", "Summer", "Fall"], ["Winter"], ["Winter", "Spring", "Summer", "Fall"], ["Winter", "Spring"], ["Winter", "Fall"]],
        style: [["business"], ["casual"], ["sports", "casual"], ["sports"], ["casual", "travel"], ["casual"], ["casual"], ["casual"], ["casual", "sports"], ["casual", "festive"]],
        brand: ["Tommy Hilfiger", "Gucci", "Nike", "Fruit Clothes", "Ray-Ban", "Almost Famous", "Polo Ralph Lauren", "Polo Ralph Lauren", "Reebok", "MSK"],
        user : ["artistconfidence","artistconfidence","ollieomit","oraclelame","ollieomit","venturetriangle","ollieomit","metalshipwreck","noisyhundred","metalshipwreck"]
    }

    for(let i = 0; i < 10; i++){
        await clothes.addNewClothes(clothes_info.name[i],
                                 clothes_info.image[i],
                                 clothes_info.type[i],
                                 clothes_info.color[i],
                                 clothes_info.season[i],
                                 clothes_info.style[i],
                                 clothes_info.brand[i],
                                 clothes_info.user[i]); 
    }

    //outfits
    let outfits_info = {
        creator: ["artistconfidence","giantdelighted","ollieomit","oraclelame","graduateaboard","venturetriangle","bobmajor","metalshipwreck","noisyhundred","pitysparkles"],
        status: ["private", "public", "private", "public", "public", "private", "public", "private", "public", "private"],
        outfitName: ["bingus drip", "Very Large Clothes", "just pokedots", "my awful design", "my good design", "my better design", "only hats", "buisness clothes", "spring vibe", "winter2022"],
        season: [["spring"], ["spring", "winter"], ["winter"], ["summer", "autumn"], ["spring", "winter"], ["winter"], ["spring"], ["summer", "winter", "spring"], ["winter"], ["spring"], ["winter"]],
        style: [["casual"], ["buisness"], ["culture", "casual"], ["casual"], ["uniform"], ["casual", "buisness"], ["party"], ["buisness", "party"], ["casual"], ["night time", "party"]]
    }

    for(let i = 0; i < 10; i++){
        await outfits.addNewOutfits(outfits_info.creator[i],
                                    [],
                                    outfits_info.status[i],
                                    outfits_info.outfitName[i],
                                    outfits_info.season[i],
                                    outfits_info.style[i])
    }

    //comments
    let comments_info = {
        commentor : ["artistconfidence","giantdelighted","ollieomit","oraclelame","graduateaboard","venturetriangle","bobmajor","metalshipwreck","noisyhundred","pitysparkles"],
        text : ["wow this looks amazing!", "im not sure about this..", "Ratio + L", "Amazing 😍😍", "wheres the hat??", "yoooooo@#(@(!23", "Hatrick Pill would love this", "The outfit looks great, but the shoes look terrifying", "nice comment", "love this outfit!!"]
    }
    
    for(let i = 0; i < 10; i++){
        await comments.addNewComment(comments_info.commentor[i], comments_info.text[i]); 
    }





    console.log('Done seeding database');

    await connection.closeConnection();
}

main();