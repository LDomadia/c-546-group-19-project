# CS 546 - Group 19 - Final Project | Digital Closet
A website that allows you to take images of your clothes and upload them online. Users can then create digital outfits from the clothes they upload.

Built using HTML, CSS, Bootstrap, Express, Node.js, and MongoDB.

## How to Setup
Since our database is running on Mongo Altas, **there is no need to seed the database**. But we have provided a seed file as a fallback.

### Using the Live Release
1. Visit the following link to use our website live on our Heroku server:  

### Running it Locally
1. Clone the repo to your machine
2. In the project folder terminal, run `npm start` to install node dependencies and start the website in the same command.
3. (Optional) run `npm run seed` to drop the current database and reseed it. However, **this will delete admin accounts**. 

### View Ready Made Accounts
There are three accounts you may use to test from. You can additionally make your own account. Here are the pre-made account logins: 
- lonelyloser | password123 
- froggyboi078 | password456
- pleaseGiveMeAnA | password789

Note: You can test the admin account feature with *lonelyloser*

## How the Application Works
Upon loading the website, you will see our home page with all the public outfits displayed. However, to view additional content, you must sign up or log into an account.

### Home Page
- **Like/Save Outfits**: You can like public outfits by clicking the "heart" icon and save public outfits by clicking the "bookmark" icon. You can also do this on when viewing the outfit in the detailed page.
- **View Outfits**: You can view details of public outfits by clicking the "View" button. You'll be able to see the creator, styles, and seasons of the outfit.
- **Comment**: You can add a comment to an outfit on the detailed view of the outfit.

### My Clothes Page
- **View All Clothing Items**: You can view all the clothing items you've created.
- **Create a Clothing Item**: Click on "Add +" at the top of the page to add a new clothing items. The required fields are the image, clothing name, and clothing type.
- **Edit a Clothing Item**: Click on "Edit" on the clothing item card to edit a clothing item.
- **Delete a Clothing Item**: Click on "Delete" on the clothing item card to delete a clothing item.

### My Outfits Page
- **View All Outfits**: You can view all the outfits you've created.
- **Create an Outfit**: Click on "Add +" at the top of the page to add a new outfit. Outfits must have at least two clothing items of different types (except for accessories).  
- **Generate an Outfit**: Click on "Generate +" at the top of the page to generate an outfit based on clothing items you own. All inputs are required.
- **Edit an Outfit**: Click on "Edit" on the outfit card to edit an outfit.
- **Delete an Outfit**: Click on "Delete" on the outfit card to delete an outfit.
- **View Liked/Saved Outfits**: Click on "View Liked Outfits" or "View Saved Outfits" to view your liked or saved outfits.

### Statistics Page
- Here, you can view statistics such as how many clothing types, colors/patterns, and brands you own. You can also view how often you've worn an outfit or clothing item

### Profile Page
- **View/Change Bio**: You can view and change your bio.
- **Add Favorite Stores**: You can add names and website links to your favorite stores.
- **Change Password**: You can change your password.
- **Delete Account**: You can delete your account. This will also delete any clothing items or outfits you have created.

### Calendar Page
- Here, you can view or log outfits you've worn on certain days. Pick a date to view the outfits worn. Click the "Log Outfits" button to log outfits. Outfits can only be logged one at a time. Multiple outfits can be worn on the same day.

### Admin Accounts
- Log into admin accounts to delete comments on outfits that do not follow community guidelines.

Note: The images users upload on the live hosted version are stored on the Heroku server. If the server is run locally, you may not be able to see the images stored on Heroku.


## GitHub Link
https://github.com/LDomadia/c-546-group-19-project
