# AnimeWiki
**Project Description:** AnimeWiki is a Node.js web application that was created for anime lovers. It allows users to create an account, log in, browse/explore anime, write reviews, and create a watchlist.
## Instructions to Run
---
### Prerequisites:
1. Make sure you have Node.js installed on your local computer
2. Need to have a MySQL database
### Setup:
1. Fork this repo
2. Clone repo to your local computer
3. Go to your database to gather your information
4. Run SQL commands (located in the dbInfo folder) in your database (this will allow you to create the tables with prefilled data)
5. Open the index.js file on your computer and replace the environment variable at line 15 with a secret key (string) and lines 339, 340, 341, and 342 with your database info
### How to Run:
1. Access the app directory on your local computer through your terminal 
2. Within the directory, run `node index.js`
3. Go to a web browser and type `localhost:3000`
4. Finally, signup to create login credentials