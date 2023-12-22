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
  //Developer Token
  client = sdk.getBasicClient('J60ywiZoDPymwUvFIxuPFvOPAGykYLTi');
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

//NotePal Folder 240811112427
app.get("/new", async function (req, res) {
  var stream = fs.createReadStream('back-end/images/PumpingLema1031.png');
  let folderID = '240811112427';
  let tag_name = "Pumping Lemma"
  let class_number = 4337;
  let course_prefix = 'CS';
  let instructor = 'Davis, Chris I; Sidheekh, Sahil; Rath, Avilash S';
  let term = 'Spring 2023';
  let section = 504;
  client.files.uploadFile(folderID, 'PumpingLema1031.png', stream)
	.then(file => {
    con.query(`INSERT INTO uploads values((SELECT class_id FROM class WHERE class_number=${class_number} AND course_prefix='${course_prefix}' AND instructor='${instructor}' AND term='${term}' AND section=${section}), ${file.entries[0].id}, '${tag_name}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL );
    `, function (error, results, fields) {
      if (error) console.log(error);
    });
    res.send(file);
  }).catch(err => {
    res.send(err);
  });
});