let express = require("express");
const fs = require('node:fs');
let app = express();
const mysql = require('mysql');
let BoxSDK = require('box-node-sdk');

let secrets;
function retrieveSecrets(){
  return new Promise((resolve, reject) =>{
    fs.readFile('.secrets', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      else{
        resolve(data.split('\n'));
      }
    });
  })

}

let con;
let server;
let sdk;
let client;

retrieveSecrets().then((result) =>{
  secrets = result;

  con = mysql.createConnection({
    host: secrets[1],
    user: secrets[2],
    password: secrets[3],
    database: secrets[4],
  });

  server = app.listen(4545, function () {
    let host = server.address().address;
    let port = server.address().port;
  }); 

  con.connect(function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("connection successful");
    }
  });

  sdk = new BoxSDK({
    clientID: secrets[5],
    clientSecret: secrets[6]
  });

  client = sdk.getBasicClient('TtfLzUC6tlJC7vo9gu3Wr96z4eyYguZg');
})


app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded());


function retrieveUploads(){
    return new Promise((resolve, reject) =>{
        con.query("SELECT * FROM tag_name", function (error, results, fields) {
            if (error) reject(error);
            else {
                resolve(results);
            }
          });
    })
}

function retrieveClasses(){
  return new Promise((resolve, reject) =>{
      con.query("SELECT * FROM class", function (error, results, fields) {
          if (error) reject(error);
          else {
              resolve(results);
          }
        });
  })
}

function retrieveTagNames(){
    return new Promise((res, rej) =>{
        con.query("SELECT * FROM tag_name", function (error, results, fields) {
            if (error) rej(error);
            else {
                res(results);
            }
          });
    })
}

app.get("/uploads", async function (req, res) {
    let uploads = await retrieveUploads();
    res.send(uploads);
});

app.get("/tag_names", async function (req, res) {
    let tag_names = await retrieveTagNames();
    res.send(tag_names);
});

app.get("/class", async function (req, res) {
    let classes = await retrieveClasses();
    res.send(classes);
});

app.get("/new", async function (req, res) {
  client.users.get(client.CURRENT_USER_ID)
	  .then(user => res.send('Hello ' + user.name + '!'))
	  .catch(err => res.send('Got an error! ' + err));
});