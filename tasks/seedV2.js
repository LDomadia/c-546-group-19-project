const connection = require('../config/mongoConnection');
const { account, clothes, outfits, comments} = require('../data/');

const main = async () => {
    const db = await connection.dbConnection();
    // await db.dropDatabase();

    try {
        await account.addNewUser('lonelyloser', 'password123');
        await account.addNewUser('froggyboi078', 'password456');
        await account.addNewUser('pleaseGiveMeAnA', 'password789');

        await clothes.addNewClothingItem(
            'Mustard Sweatshirt',
            'seed_images/IMG_0175.jpg',
            'outerwear',
            'S',
            ['mustard'],
            ['winter', 'fall', 'spring'],
            ['casual', 'leisure'],
            'Aeropostle',
            'lonelyloser'
        );
    
        await clothes.addNewClothingItem(
            'Floral Clutch',
            'seed_images/IMG_0138.jpg',
            'accessory',
            null,
            ['brown', 'floral'],
            ['summer', 'fall', 'spring'],
            ['casual'],
            'Nine West',
            'lonelyloser'
        );
    
        await clothes.addNewClothingItem(
            'Superman Cape',
            'seed_images/IMG_0174.jpg',
            'accessory',
            null,
            ['blue', 'gold'],
            ['summer', 'fall', 'spring', 'winter'],
            ['costume'],
            null,
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'Blue Hoodie',
            'seed_images/IMG_0173.jpg',
            'outerwear',
            'XS',
            ['blue'],
            ['fall', 'spring', 'winter'],
            ['casual', 'leisure'],
            'Hollister',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Gold Polka Dot Headband',
            'seed_images/IMG_0172.jpg',
            'accessory',
            null,
            ['gold', 'white'],
            ['fall', 'spring', 'summer'],
            ['casual'],
            null,
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Lavender Crossbody Bag',
            'seed_images/IMG_0171.jpg',
            'accessory',
            null,
            ['lavender', 'floral'],
            ['spring', 'summer'],
            ['casual'],
            'Vera Bradley',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Socks with Foxes',
            'seed_images/IMG_0170.jpg',
            'socks',
            null,
            ['gray', 'green'],
            ['winter'],
            ['leisure'],
            null,
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Cat Christmas Socks',
            'seed_images/IMG_0169.jpg',
            'socks',
            null,
            ['black', 'green', 'red'],
            ['winter'],
            ['leisure'],
            null,
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Pink Llama Socks',
            'seed_images/IMG_0168.jpg',
            'socks',
            null,
            ['pink', 'white', 'magenta'],
            ['winter'],
            ['leisure'],
            null,
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'Pink Cuffed Shirt',
            'seed_images/IMG_0159.jpg',
            'top',
            'XS',
            ['pink'],
            ['winter'],
            ['casual'],
            'Rewind',
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'Blue Sweatpants',
            'seed_images/IMG_0160.jpg',
            'bottom',
            'S',
            ['blue'],
            ['winter'],
            ['leisure'],
            'Aeropostle',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Graphic Leggings',
            'seed_images/IMG_0161.jpg',
            'bottom',
            'S',
            ['blue', 'white', 'pink', 'purple'],
            ['summer', 'spring'],
            ['sporty'],
            'Gaiam',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Black Sport Leggings',
            'seed_images/IMG_0162.jpg',
            'bottom',
            'S',
            ['blue', 'black', 'green', 'purple'],
            ['summer', 'spring'],
            ['sporty'],
            'Aeropostle',
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Blue Jeans',
            'seed_images/IMG_0163.jpg',
            'bottom',
            '3',
            ['blue'],
            ['summer', 'spring', 'winter', 'fall'],
            ['casual'],
            null,
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Gray Leggings',
            'seed_images/IMG_0164.jpg',
            'bottom',
            'S',
            ['gray'],
            ['summer', 'spring', 'winter', 'fall'],
            ['casual'],
            null,
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'White Puffer Jacket',
            'seed_images/IMG_0165.jpg',
            'outerwear',
            'XS',
            ['gray'],
            ['winter'],
            ['casual'],
            'Aeropostle',
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Gray Bomber Jacket',
            'seed_images/IMG_0166.jpg',
            'outerwear',
            'S',
            ['gray'],
            ['winter'],
            ['casual'],
            null,
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Teal Crossbody Bag',
            'seed_images/IMG_0167.jpg',
            'accessory',
            null,
            ['teal', 'floral'],
            ['spring', 'summer'],
            ['casual'],
            'Vera Bradley',
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Maroon Shirt',
            'seed_images/IMG_0158.jpg',
            'top',
            'S',
            ['maroon'],
            ['spring', 'summer'],
            ['casual'],
            'Rewind',
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'Navy Striped Sweater',
            'seed_images/IMG_0157.jpg',
            'top',
            'S',
            ['navy', 'mint', 'gray'],
            ['winter'],
            ['casual'],
            'Rewind',
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'Black Striped Sweater',
            'seed_images/IMG_0156.jpg',
            'top',
            'S',
            ['white', 'black'],
            ['winter'],
            ['casual'],
            'Arizona',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'NY Giants Longsleeve',
            'seed_images/IMG_0155.jpg',
            'top',
            'S',
            ['gray', 'blue', 'red', 'white'],
            ['winter', 'fall'],
            ['casual', 'sporty'],
            null,
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Under Armour Shirt',
            'seed_images/IMG_0154.jpg',
            'top',
            'S',
            ['blue', 'white'],
            ['spring', 'summer'],
            ['casual', 'sporty'],
            'Under Armour',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Teal Activewear Shirt',
            'seed_images/IMG_0153.jpg',
            'top',
            'XS',
            ['teal'],
            ['spring', 'summer'],
            ['casual', 'sporty'],
            'Under Armour',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Stevens Shirt',
            'seed_images/IMG_0152.jpg',
            'top',
            'XS',
            ['red', 'white'],
            ['spring', 'summer'],
            ['casual', 'sporty'],
            'Nike',
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Black Paisley',
            'seed_images/IMG_0151.jpg',
            'dress',
            'XS',
            ['red', 'white', 'black'],
            ['spring', 'summer'],
            ['casual',],
            'Aeropostle',
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Navy Formal Dress',
            'seed_images/IMG_0150.jpg',
            'dress',
            'XS',
            ['navy'],
            ['spring', 'summer'],
            ['formal'],
            'H&M',
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'White Lace Dress',
            'seed_images/IMG_0149.jpg',
            'dress',
            'XS',
            ['white'],
            ['spring', 'summer'],
            ['formal', 'casual'],
            'Eyelash',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Pink Sneakers',
            'seed_images/IMG_0142.jpg',
            'shoes',
            '6',
            ['pink', 'blue', 'lime'],
            ['spring', 'summer'],
            ['sporty'],
            'Asics',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'White Casual Sneakers',
            'seed_images/IMG_0143.jpg',
            'shoes',
            '6',
            ['white'],
            ['spring', 'summer', 'winter', 'fall'],
            ['casual'],
            'Roxy',
            'froggyboi078'
        );

        await clothes.addNewClothingItem(
            'Black Heels',
            'seed_images/IMG_0145.jpg',
            'shoes',
            '6',
            ['black'],
            ['spring', 'summer', 'winter', 'fall'],
            ['formal'],
            'Sonoma',
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'Navy Uggs',
            'seed_images/IMG_0144.jpg',
            'shoes',
            '6',
            ['navy'],
            ['winter', 'fall'],
            ['casual', 'leisure'],
            'Ugg',
            'lonelyloser'
        );

        await clothes.addNewClothingItem(
            'Blue Casual Heels',
            'seed_images/IMG_0146.jpg',
            'shoes',
            '6',
            ['blue'],
            ['spring', 'summer'],
            ['casual'],
            'Sonoma',
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Slate Uggs',
            'seed_images/IMG_0147.jpg',
            'shoes',
            '6',
            ['slate', 'gray'],
            ['winter', 'fall'],
            ['casual', 'leisure'],
            'Sonoma',
            'pleaseGiveMeAnA'
        );

        await clothes.addNewClothingItem(
            'Black Combat Boots',
            'seed_images/IMG_0148.jpg',
            'shoes',
            '6',
            ['black'],
            ['winter', 'fall', 'spring'],
            ['casual'],
            'So',
            'pleaseGiveMeAnA'
        );
        
    } catch (e) {
        console.log(e);
    }

    console.log('Done seeding database');
    connection.closeConnection();
};

main();
