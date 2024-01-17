const express = require("express");
const fs = require('node:fs');
const app = express();
const mysql = require('mysql');
const BoxSDK = require('box-node-sdk');
const fileUpload = require('express-fileupload');
const { Readable } = require("node:stream");
const axios = require('axios');
const MultiStream = require('multistream');



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
  client = sdk.getBasicClient('m1PMek2gDPvhKoaVYFqU0iOXEVczLug4');
})

const cors=require("cors");
const { type } = require("node:os");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded());
app.use(fileUpload());


function updateTags(tagName){
  return new Promise((resolve, reject) =>{
      con.query(`INSERT INTO tag_name VALUES ('${tagName}');`, function (error, results, fields) {
          if (error) reject(error);
          else {
              resolve(results);
          }
        });
  })
}

function SQLequivalenceFormat(value){
  if (value === "undefined"){
    return "IS NULL";
  }
  else{
    return `= '${value}'`
  }
}

function checkExistence(coursePrefix, classNumber, section, instructor){
  return new Promise((resolve, reject) =>{
    let SQLquery = `SELECT * FROM class WHERE course_prefix ${SQLequivalenceFormat(coursePrefix)} AND class_number ${SQLequivalenceFormat(classNumber)} AND section ${SQLequivalenceFormat(section)} AND instructor ${SQLequivalenceFormat(instructor)}`;
    console.log(SQLquery);
    con.query(SQLquery, function (error, results, fields) {
        if (error) reject(error);
        else {
            resolve(results);
        }
      });
  })
}

function tagFormatting(tags){
  let formattedTags = Array(15).fill("NULL");
  for(let i = 0; i < tags.length; i++){
    formattedTags[i] = "'" + tags[i] + "'";
  }
  return formattedTags.join(", ")
}

function retrieveClassInfo(string){
  return new Promise((resolve, reject) =>{
      con.query(`SELECT DISTINCT ${string} FROM class`, function (error, results, fields) {
          if (error) reject(error);
          else {
              resolve(results);
          }
        });
  })
}

function retrieveDistinctClasses(){
  return new Promise((resolve, reject) =>{
      con.query("SELECT DISTINCT course_prefix, class_number, instructor FROM class ORDER BY term;", function (error, results, fields) {
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

function retrieveUploads(){
  return new Promise((res,  rej) =>{
    let SQLquery = `SELECT upload_id FROM uploads`;
    con.query(SQLquery, function(error, results, fields){
      if (error) rej(error);
      else{res(results);}
    })
  })
}

//possible bug: a file with the same name as another uploaded will result in an error
app.post("/uploadSearchParameters/:coursePrefix;:classNumber;:section;:instructor;:term;:tags", async function(req, res){
  // Will show as undefined if unavailable
  console.log(req.params.coursePrefix, req.params.classNumber, req.params.section, req.params.instructor);
  let coursePrefix = req.params.coursePrefix === "undefined" || req.params.coursePrefix === "null" ? "undefined" : JSON.parse(req.params.coursePrefix)["label"];
  let classNumber = req.params.classNumber === "undefined" || req.params.classNumber === "null" ? "undefined" : JSON.parse(req.params.classNumber)["label"];
  let section = req.params.section === "undefined" || req.params.section === "null" ? "undefined" : JSON.parse(req.params.section)["label"];
  let instructor = req.params.instructor === "undefined" || req.params.instructor === "null" ? "undefined" : JSON.parse(req.params.instructor)["label"];
  let term = req.params.term === "undefined" || req.params.term === "null" ? "undefined" : JSON.parse(req.params.term)["label"];
  let tags = req.params.tags === "undefined" || req.params.tags === "null" ? "undefined" : JSON.parse(req.params.tags);
  console.log(`Tags: ${tags}`);
  if(tags === "undefined"){
    res.send(JSON.stringify("NO TAGS"));
  }
  else{
    let currentTags = await retrieveTagNames();
    currentTags.forEach((element, index, arr) =>{
      arr[index] = element[Object.keys(element)[0]]
    })
    for(let i = 0; i < tags.length; i++){
      if((typeof tags[i] === "object")){
        tags[i] = tags[i]["label"];
      }
    }
    tags.forEach((element, index, Arr) =>{
      if(!currentTags.includes(element.toLowerCase())){
        console.log(`current tags: ${currentTags}`);
        console.log(`new tag: ${element}`);
        updateTags(element.toLowerCase());
      }
      else{
        Arr[index] = element.toLowerCase();
      }
    })
    checkExistence(coursePrefix, classNumber, section, instructor).then(async (results) =>{
      let class_id = results[0].class_id;
      let fileName = req.files.file.name;
      let file = req.files.file.data;
      console.log(file)
      return [await client.files.uploadFile('240811112427', fileName, file), class_id];
    })
    .then((response) =>{
      let formattedTags = tagFormatting(tags);
      let SQLquery = `INSERT INTO uploads VALUES(${response[1]}, ${response[0].entries[0].id}, ${formattedTags});`;
      console.log(SQLquery);
      con.query(SQLquery, function (error, results, fields) {
        if (error) console.log(error);
      })
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify("SUCCESS"));
    })
    .catch((error) =>{
      console.log(error);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify("ERROR"));
    })
  }
});

app.get("/getUploadID/:searchQuery", async function(req, res){
  let uploadID = [];
  let uploads = await retrieveUploads();
  uploads.forEach((element) =>{
    uploadID.push(element[Object.keys(element)[0]]);
  })
  res.send(uploadID);
})


app.get("/generalInformation/:filter", async function(req, res){
  let data;
  if(req.params.filter == "tags"){
    data = await retrieveTagNames()
  }
  else{
    data = await retrieveClassInfo(req.params.filter);
  }
  let formattedData = [];
  data.forEach(element => {
    let temp = {};
    if (element[Object.keys(element)[0]] == null){
      return;
    }
    temp["label"] = element[Object.keys(element)[0]];
    formattedData.push(temp);
  });
  res.send(formattedData);
})

app.get("/searchFormat", async function (req, res){
  console.log("Data requested");
  let tag_names = await retrieveTagNames();
  let classes = await retrieveDistinctClasses();
  let formattedClasses = [];
  classes.forEach(element => {
    let temp = {};
    let string = [element.course_prefix, element.class_number, element.instructor];
    temp["label"] = (string.join(" "));
    formattedClasses.push(temp)
  });
  tag_names.forEach(element => {
    let temp = {};
    temp["label"] = element.tag_name;
    formattedClasses.push(temp)
  })
  res.send(formattedClasses);
})

//Example get request that the front-end will have to use. (data in the Box is in UTF8 format as an ArrayBuffer data type, not sure how compatible ArrayBuffer is to Blob, which is the FrontEnd equivalent... may be a problem for displaying pictures down the line)
app.get("/testNewUpload", async function (req, res) {
  let fileName = 'back-end/images/PumpingLema1031.png';
  let formData = new FormData();
  fs.readFile(fileName, 'utf8', async function(err, image) {
    if (err) res.send(err);
    formData.append("name", "PumpingLema1031.png")
    formData.append("file", image);
    formData.append("tag_name1", "Pumping Lemma")
    formData.append("tag_name2", "NULL")
    formData.append("tag_name3", "NULL")
    formData.append("tag_name4", "NULL")
    formData.append("tag_name5", "NULL")
    formData.append("tag_name6", "NULL")
    formData.append("tag_name7", "NULL")
    formData.append("tag_name8", "NULL")
    formData.append("tag_name9", "NULL")
    formData.append("tag_name10", "NULL")
    formData.append("tag_name11", "NULL")
    formData.append("tag_name12", "NULL")
    formData.append("tag_name13", "NULL")
    formData.append("tag_name14", "NULL")
    formData.append("tag_name15", "NULL")
    formData.append("class_number", "4337")
    formData.append("course_prefix", "CS")
    formData.append("instructor", "Davis, Chris I; Sidheekh, Sahil; Rath, Avilash S")
    formData.append("term", "Spring 2023")
    formData.append("section", "504")
    let data = await axios.post('http://localhost:4545/newUpload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    res.send(data.data);
  });
});

//NotePal Folder 240811112427
app.post("/newUpload", async function (req, res) {
  console.log("Request Received");

  let sampleFile = req.body.file;
  let fileName = req.body.name;

  let folderID = '240811112427';

  let tag_name1 = '\'' + req.body.tag_name1 + '\'';
  let tag_name2 = (req.body.tag_name2 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name2 + '\'');
  let tag_name3 = (req.body.tag_name3 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name3 + '\'');
  let tag_name4 = (req.body.tag_name4 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name4 + '\'');
  let tag_name5 = (req.body.tag_name5 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name5 + '\'');
  let tag_name6 = (req.body.tag_name6 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name6 + '\'');
  let tag_name7 = (req.body.tag_name7 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name7 + '\'');
  let tag_name8 = (req.body.tag_name8 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name8 + '\'');
  let tag_name9 = (req.body.tag_name9 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name9 + '\'');
  let tag_name10 = (req.body.tag_name10 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name10 + '\'');
  let tag_name11 = (req.body.tag_name11 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name11 + '\'');
  let tag_name12 = (req.body.tag_name12 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name12 + '\'');
  let tag_name13 = (req.body.tag_name13 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name13 + '\'');
  let tag_name14 = (req.body.tag_name14 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name14 + '\'');
  let tag_name15 = (req.body.tag_name15 == 'NULL' ) ? 'NULL' : ('\'' + req.body.tag_name15 + '\'');
  let class_number = req.body.class_number;
  let course_prefix = req.body.course_prefix;
  let instructor = req.body.instructor;
  let term = req.body.term;
  let section = req.body.section;

  client.files.uploadFile(folderID, fileName, sampleFile)
	.then(file => {
    con.query(`INSERT INTO uploads values((SELECT class_id FROM class WHERE class_number=${class_number} AND course_prefix='${course_prefix}' AND instructor='${instructor}' AND term='${term}' AND section=${section}), ${file.entries[0].id}, ${tag_name1}, ${tag_name2}, ${tag_name3}, ${tag_name4}, ${tag_name5}, ${tag_name6}, ${tag_name7}, ${tag_name8}, ${tag_name9}, ${tag_name10}, ${tag_name11}, ${tag_name12}, ${tag_name13}, ${tag_name14}, ${tag_name15} );`, function (error, results, fields) {
      if (error) console.log(error);
    });
    res.send("Successfully Received");
  }).catch(err => {
    console.log(err);
    console.log("Error");
    res.send("Error");
  });
});