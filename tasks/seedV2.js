const connection = require('../config/mongoConnection');
const { account, clothes, outfits, comments} = require('../data/');

const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    try {
        await account.addNewUser('lonelyloser', 'password123');
        await account.addNewUser('froggyboi078', 'password456');
        await account.addNewUser('pleaseGiveMeAnA', 'password789');

        const item0 = await clothes.addNewClothingItem(
            'Mustard Sweatshirt',
            'seed_images/img_0175.jpg',
            'outerwear',
            'S',
            ['mustard'],
            ['winter', 'fall', 'spring'],
            ['casual', 'leisure'],
            'Aeropostle',
            'lonelyloser'
        );
    
        const item1 = await clothes.addNewClothingItem(
            'Floral Clutch',
            'seed_images/img_0138.jpg',
            'accessory',
            null,
            ['brown', 'floral'],
            ['summer', 'fall', 'spring'],
            ['casual'],
            'Nine West',
            'lonelyloser'
        );
    
        const item2 = await clothes.addNewClothingItem(
            'Superman Cape',
            'seed_images/img_0174.jpg',
            'accessory',
            null,
            ['blue', 'gold'],
            ['summer', 'fall', 'spring', 'winter'],
            ['costume'],
            null,
            'lonelyloser'
        );

        const item3 = await clothes.addNewClothingItem(
            'Blue Hoodie',
            'seed_images/img_0173.jpg',
            'outerwear',
            'XS',
            ['blue'],
            ['fall', 'spring', 'winter'],
            ['casual', 'leisure'],
            'Hollister',
            'froggyboi078'
        );

        const item4 = await clothes.addNewClothingItem(
            'Gold Polka Dot Headband',
            'seed_images/img_0172.jpg',
            'accessory',
            null,
            ['gold', 'white'],
            ['fall', 'spring', 'summer'],
            ['casual'],
            null,
            'froggyboi078'
        );

        const item5 = await clothes.addNewClothingItem(
            'Lavender Crossbody Bag',
            'seed_images/img_0171.jpg',
            'accessory',
            null,
            ['lavender', 'floral'],
            ['spring', 'summer'],
            ['casual'],
            'Vera Bradley',
            'froggyboi078'
        );

        const item6 = await clothes.addNewClothingItem(
            'Socks with Foxes',
            'seed_images/img_0170.jpg',
            'socks',
            null,
            ['gray', 'green'],
            ['winter'],
            ['leisure'],
            null,
            'pleaseGiveMeAnA'
        );

        const item7 = await clothes.addNewClothingItem(
            'Cat Christmas Socks',
            'seed_images/img_0169.jpg',
            'socks',
            null,
            ['black', 'green', 'red'],
            ['winter'],
            ['leisure'],
            null,
            'froggyboi078'
        );

        const item8 = await clothes.addNewClothingItem(
            'Pink Llama Socks',
            'seed_images/img_0168.jpg',
            'socks',
            null,
            ['pink', 'white', 'magenta'],
            ['winter'],
            ['leisure'],
            null,
            'lonelyloser'
        );

        const item9 = await clothes.addNewClothingItem(
            'Pink Cuffed Shirt',
            'seed_images/img_0159.jpg',
            'top',
            'XS',
            ['pink'],
            ['winter'],
            ['casual'],
            'Rewind',
            'lonelyloser'
        );

        const item10 = await clothes.addNewClothingItem(
            'Blue Sweatpants',
            'seed_images/img_0160.jpg',
            'bottom',
            'S',
            ['blue'],
            ['winter'],
            ['leisure'],
            'Aeropostle',
            'froggyboi078'
        );

        const item11 = await clothes.addNewClothingItem(
            'Graphic Leggings',
            'seed_images/img_0161.jpg',
            'bottom',
            'S',
            ['blue', 'white', 'pink', 'purple'],
            ['summer', 'spring'],
            ['sporty'],
            'Gaiam',
            'froggyboi078'
        );

        const item12 = await clothes.addNewClothingItem(
            'Black Sport Leggings',
            'seed_images/img_0162.jpg',
            'bottom',
            'S',
            ['blue', 'black', 'green', 'purple'],
            ['summer', 'spring'],
            ['sporty'],
            'Aeropostle',
            'pleaseGiveMeAnA'
        );

        const item13 = await clothes.addNewClothingItem(
            'Blue Jeans',
            'seed_images/img_0163.jpg',
            'bottom',
            '3',
            ['blue'],
            ['summer', 'spring', 'winter', 'fall'],
            ['casual'],
            null,
            'pleaseGiveMeAnA'
        );

        const item14 = await clothes.addNewClothingItem(
            'Gray Leggings',
            'seed_images/img_0164.jpg',
            'bottom',
            'S',
            ['gray'],
            ['summer', 'spring', 'winter', 'fall'],
            ['casual'],
            null,
            'lonelyloser'
        );

        const item15 = await clothes.addNewClothingItem(
            'White Puffer Jacket',
            'seed_images/img_0165.jpg',
            'outerwear',
            'XS',
            ['gray'],
            ['winter'],
            ['casual'],
            'Aeropostle',
            'pleaseGiveMeAnA'
        );

        const item16 = await clothes.addNewClothingItem(
            'Gray Bomber Jacket',
            'seed_images/img_0166.jpg',
            'outerwear',
            'S',
            ['gray'],
            ['winter'],
            ['casual'],
            null,
            'pleaseGiveMeAnA'
        );

        const item17 = await clothes.addNewClothingItem(
            'Teal Crossbody Bag',
            'seed_images/img_0167.jpg',
            'accessory',
            null,
            ['teal', 'floral'],
            ['spring', 'summer'],
            ['casual'],
            'Vera Bradley',
            'pleaseGiveMeAnA'
        );

        const item18 = await clothes.addNewClothingItem(
            'Maroon Shirt',
            'seed_images/img_0158.jpg',
            'top',
            'S',
            ['maroon'],
            ['spring', 'summer'],
            ['casual'],
            'Rewind',
            'lonelyloser'
        );

        const item19 = await clothes.addNewClothingItem(
            'Navy Striped Sweater',
            'seed_images/img_0157.jpg',
            'top',
            'S',
            ['navy', 'mint', 'gray'],
            ['winter'],
            ['casual'],
            'Rewind',
            'lonelyloser'
        );

        const item20 = await clothes.addNewClothingItem(
            'Black Striped Sweater',
            'seed_images/img_0156.jpg',
            'top',
            'S',
            ['white', 'black'],
            ['winter'],
            ['casual'],
            'Arizona',
            'froggyboi078'
        );

        const item21 = await clothes.addNewClothingItem(
            'NY Giants Longsleeve',
            'seed_images/img_0155.jpg',
            'top',
            'S',
            ['gray', 'blue', 'red', 'white'],
            ['winter', 'fall'],
            ['casual', 'sporty'],
            null,
            'froggyboi078'
        );

        const item22 = await clothes.addNewClothingItem(
            'Under Armour Shirt',
            'seed_images/img_0154.jpg',
            'top',
            'S',
            ['blue', 'white'],
            ['spring', 'summer'],
            ['casual', 'sporty'],
            'Under Armour',
            'froggyboi078'
        );

        const item23 = await clothes.addNewClothingItem(
            'Teal Activewear Shirt',
            'seed_images/img_0153.jpg',
            'top',
            'XS',
            ['teal'],
            ['spring', 'summer'],
            ['casual', 'sporty'],
            'Under Armour',
            'froggyboi078'
        );

        const item24 = await clothes.addNewClothingItem(
            'Stevens Shirt',
            'seed_images/img_0152.jpg',
            'top',
            'XS',
            ['red', 'white'],
            ['spring', 'summer'],
            ['casual', 'sporty'],
            'Nike',
            'pleaseGiveMeAnA'
        );

        const item25 = await clothes.addNewClothingItem(
            'Black Paisley Dress',
            'seed_images/img_0151.jpg',
            'dress',
            'XS',
            ['red', 'white', 'black'],
            ['spring', 'summer'],
            ['casual',],
            'Aeropostle',
            'pleaseGiveMeAnA'
        );

        const item26 = await clothes.addNewClothingItem(
            'Navy Formal Dress',
            'seed_images/img_0150.jpg',
            'dress',
            'XS',
            ['navy'],
            ['spring', 'summer'],
            ['formal'],
            'H&M',
            'lonelyloser'
        );

        const item27 = await clothes.addNewClothingItem(
            'White Lace Dress',
            'seed_images/img_0149.jpg',
            'dress',
            'XS',
            ['white'],
            ['spring', 'summer'],
            ['formal', 'casual'],
            'Eyelash',
            'froggyboi078'
        );

        const item28 = await clothes.addNewClothingItem(
            'Pink Sneakers',
            'seed_images/img_0142.jpg',
            'shoes',
            '6',
            ['pink', 'blue', 'lime'],
            ['spring', 'summer'],
            ['sporty'],
            'Asics',
            'froggyboi078'
        );

        const item29 = await clothes.addNewClothingItem(
            'White Casual Sneakers',
            'seed_images/img_0143.jpg',
            'shoes',
            '6',
            ['white'],
            ['spring', 'summer', 'winter', 'fall'],
            ['casual'],
            'Roxy',
            'froggyboi078'
        );

        const item30 = await clothes.addNewClothingItem(
            'Black Heels',
            'seed_images/img_0145.jpg',
            'shoes',
            '6',
            ['black'],
            ['spring', 'summer', 'winter', 'fall'],
            ['formal'],
            'Sonoma',
            'lonelyloser'
        );

        const item31 = await clothes.addNewClothingItem(
            'Navy Uggs',
            'seed_images/img_0144.jpg',
            'shoes',
            '6',
            ['navy'],
            ['winter', 'fall'],
            ['casual', 'leisure'],
            'Ugg',
            'lonelyloser'
        );

        const item32 = await clothes.addNewClothingItem(
            'Blue Casual Heels',
            'seed_images/img_0146.jpg',
            'shoes',
            '6',
            ['blue'],
            ['spring', 'summer'],
            ['casual'],
            'Sonoma',
            'pleaseGiveMeAnA'
        );

        const item33 = await clothes.addNewClothingItem(
            'Slate Uggs',
            'seed_images/img_0147.jpg',
            'shoes',
            '6',
            ['slate', 'gray'],
            ['winter', 'fall'],
            ['casual', 'leisure'],
            'Sonoma',
            'pleaseGiveMeAnA'
        );

        const item34 = await clothes.addNewClothingItem(
            'Black Combat Boots',
            'seed_images/img_0148.jpg',
            'shoes',
            '6',
            ['black'],
            ['winter', 'fall', 'spring'],
            ['casual'],
            'So',
            'pleaseGiveMeAnA'
        );

        const outfit1 = await outfits.addNewOutfits(
            'pleaseGiveMeAnA',
            [item24.id, item12.id, item6.id, item34.id],
            'public',
            'Sporty Outfit',
            ['summer', 'spring'],
            ['sporty']            
        );

        const outfit2 = await outfits.addNewOutfits(
            'pleaseGiveMeAnA',
            [item25.id, item17.id, item32.id],
            'public',
            'Dinner Outfit',
            ['summer', 'spring'],
            ['casual', 'dress-up']            
        );

        const outfit3 = await outfits.addNewOutfits(
            'pleaseGiveMeAnA',
            [item16.id, item13.id, item33.id],
            'public',
            'Chilly Day Outfit',
            ['winter'],
            ['casual']            
        );

        const outfit4 = await outfits.addNewOutfits(
            'lonelyloser',
            [item0.id, item14.id, item18.id, item31.id],
            'public',
            'Casual School Outfit',
            ['winter'],
            ['casual']            
        );

        const outfit5 = await outfits.addNewOutfits(
            'lonelyloser',
            [item26.id, item30.id, item1.id],
            'public',
            'Dinner Party Outfit',
            ['fall', 'spring', 'summer'],
            ['formal']            
        );

        const outfit6 = await outfits.addNewOutfits(
            'lonelyloser',
            [item19.id, item2.id, item14.id],
            'public',
            'Sitting At Home',
            ['fall', 'spring', 'winter'],
            ['leisure']            
        );

        const outfit7 = await outfits.addNewOutfits(
            'froggyboi078',
            [item22.id, item11.id, item28.id],
            'public',
            'Running Outfit',
            ['fall', 'spring', 'summer'],
            ['sporty']            
        );

        const outfit8 = await outfits.addNewOutfits(
            'froggyboi078',
            [item4.id, item5.id, item27.id, item29.id],
            'public',
            'Picnic Outfit',
            ['fall', 'spring', 'summer'],
            ['casual']            
        );

        const outfit9 = await outfits.addNewOutfits(
            'froggyboi078',
            [item3.id, item10.id],
            'public',
            'Very Leisure Outfit',
            ['fall', 'winter'],
            ['casual', 'leisure']            
        );
        
    } catch (e) {
        console.log(e);
    }

    console.log('Done seeding database');
    connection.closeConnection();
};

main();
