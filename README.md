# NotePal
### Description
NotePal is a note-sharing application for UTD, created and maintained by the Theta Tau Alpha fraternity. Users can *anonymously* upload notes or other materials relevant to their classes by specifying class information (ex. CS 1336 w/ Professor X) and tag(s) that classify the information within the provided notes (ex. Product Rule). Users can also *anonymously* search for notes by class or tag.

Note uploads will be monitored using image-detection ML algorithms to protect the system from explicit or non-relevant images.

### Architecture
The front end is built using React.js, the APIs of the back-end are built using Node.js/Express.js and Flask, the ML model is built using PyTorch (Binary Classification Model using a pre-designed convolutional neural network that is trained on more than a million images from the ImageNet database[^\[1\]^](https://www.mathworks.com/help/deeplearning/ref/efficientnetb0.html) called efficientnet_b0), the images are stored in a "bucket" architecture (similar to an AWS S3 bucket) on the [Box](https://Box.com). Image metada is organized in an SQL RDMS called MariaDB (community-developed, commercially supported fork of the MySQL[^\[2\]^](https://www2.computerworld.com.au/article/457551/dead_database_walking_mysql_creator_why_future_belongs_mariadb/)) Additionally, the certain static information is cached using the redis platform. The application servers are self-hosted and self-run.

### Credits
This project is the idea of Ashar Alvany, developed and expanded on by the NotePal Team at [Theta Tau Alpha](https://www.ttautd.com) (UTD Fraternity). The project's backend relies on an API developed by [UTD's Nebula Labs](https://www.utdnebula.com/). Finally, we are hoping to get the word out using [UTD Mercury](https://utdmercury.com/).

---
### How to Run
0. Make sure git and node are installed
1. Download the repo
    ```bash
    mkdir NotePal
    git init
    git branch -m main
    git remote add origin https://github.com/ThejasKumar100/NotePal
    git pull origin main
    ```
2. Go to the [Box](https://www.box.com) website and sign in with your UTD email. Create a folder named "NotePal". Open the folder. The folder ID can be found within the URL after the final forward slash. This ID will replace the existing number at back-end/server.js line 274.![alt text](read-me-images/image.png)![alt text](read-me-images/image-1.png)
3. Go to the [Box Developer Console](https://utdallas.app.box.com/developers/console) and create a new custom app (purpose is other and any specification is okay, use User Authentication (OAuth 2.0)). Add your OAuth2.0 Credentials (under the Configuration tab) to the .secrets document. Generate a Developer Token (also under the Configuration tab), and paste it in back-end/server.js at line 66. This token needs to be regenerated every hour.![alt text](read-me-images/image-2.png).
4. Create a file called .secrets in the back-end folder consisting of MariaDB connection info, Box info, and API keys (request this file from the project lead).
5. Run the back-end 
```bash
cd back-end
npm install
node server.js
```
6. Run the front-end
```bash
cd react-front-end
npm install
npm run dev
```
![alt text](read-me-images/image-3.png)

### Current Bugs

- The search results do not immediately update for a user if that user uploads a new tag that needs to be added to the possible search options

### Future Features

- (WIP) Machine Learning model to auto remove certain categories of non-relevant pictures
- Creating a systematic approach to commenting/reacting to posted notes
- Allow the uploading of PDF's (autoconversion on the backend?)