const express = require("express");
const fs = require('node:fs');
const app = express();
const mysql = require('mysql');
const BoxSDK = require('box-node-sdk');
const fileUpload = require('express-fileupload');
const { Readable } = require("node:stream");
const axios = require('axios');
const MultiStream = require('multistream');
const qs = require("querystring")



let secrets;
function retrieveSecrets(){
  return new Promise((resolve, reject) =>{
    fs.readFile('.secrets', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      else{
        arr = []
        data.split("\n").forEach(element => {
          arr.push(element.trim())
        });
        resolve(arr)
      }
    });
  })
  

}

let con;
let server;
let sdk;
let client;
let refresh;

setInterval(async ()=>{
  const authenticationUrl = "https://api.box.com/oauth2/token";

  let tokens = await axios
  .post(
    authenticationUrl,
    qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh,
      client_id: "hkoogqpabx0z8kb1m5u5dcmpo33mkzit",
      client_secret: "pw7HV0LTmyhFt2itiBY0xwNSIrsfgdyx",
    })
  )
  .then((response) => response.data);
  console.log(tokens)
  refresh = tokens.refresh_token
  client = sdk.getBasicClient(tokens.access_token)

}, 1000*60*30)

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
  client = sdk.getBasicClient('VzzfHtOT4QdFOaZGZwSlCrJbZFR02G8j');
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

function retrieveClassInfoUpload(string){
  return new Promise((resolve, reject) =>{
      con.query(`SELECT DISTINCT ${string} FROM class;`, function (error, results, fields) {
          if (error) {
            console.log(error)
            reject(error);
          }
          else {
            console.log(results);
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

function retrieveClassInfo(upload_id){
  return new Promise((res, rej) =>{
    let SQLquery = `SELECT CONCAT(COALESCE(course_prefix, ''), ' ', COALESCE(class_number, ''), ' ', COALESCE(instructor, '')) AS class_name FROM class WHERE class_id=(SELECT class_id FROM uploads WHERE upload_id=${upload_id});`
    con.query(SQLquery, function(error, results, fields){
      if (error) rej(error);
      else{res(results);}
    });
  })
}

function retrieveUploadIDFromTags(tag_name){
  return new Promise((res, rej) =>{
    let SQLquery= `SELECT upload_id FROM uploads WHERE tag_name_1 LIKE '%${tag_name}%' OR tag_name_2 LIKE '%${tag_name}%' OR tag_name_3 LIKE '%${tag_name}%' OR tag_name_4 LIKE '%${tag_name}%' OR tag_name_5 LIKE '%${tag_name}%' OR tag_name_6 LIKE '%${tag_name}%' OR tag_name_7 LIKE '%${tag_name}%' OR tag_name_8 LIKE '%${tag_name}%' OR tag_name_9 LIKE '%${tag_name}%' OR tag_name_10 LIKE '%${tag_name}%' OR tag_name_11 LIKE '%${tag_name}%' OR tag_name_12 LIKE '%${tag_name}%' OR tag_name_13 LIKE '%${tag_name}%' OR tag_name_14 LIKE '%${tag_name}%' OR tag_name_15 LIKE '%${tag_name}%';`;
    con.query(SQLquery, function(error, results, fields){
      if (error) rej(error);
      else{res(results);}
    })
  })
}

function retrieveTagInfo(upload_id){
  return new Promise((res, rej)=>{
    let SQLquery = `SELECT tag_name_1,tag_name_2,tag_name_3,tag_name_4,tag_name_5,tag_name_6,tag_name_7,tag_name_8,tag_name_9,tag_name_10,tag_name_11,tag_name_12,tag_name_13,tag_name_14,tag_name_15 FROM uploads WHERE upload_id=${upload_id};`
    con.query(SQLquery, function(error, results, fields){
      if (error) rej(error);
      else{res(results);}
    });
  })
}

function retrieveClassID(class_name){
  return new Promise((res, rej) =>{
    let SQLquery = `SELECT class_id FROM (SELECT class_id, CONCAT(COALESCE(course_prefix, ''), ' ', COALESCE(class_number, ''), ' ', COALESCE(instructor, '')) AS class_name FROM class HAVING class_name LIKE '%${class_name}%') AS t;`;
    con.query(SQLquery, function(error, results, fields){
      if (error) rej(error);
      else{
        // needs to be completed running a SELECT upload_id FROM uploads WHERE class_id=''; for each returned class_id
        res(retrieveUploadID(results));
      }
    })
  })
}

// sample input [{"class_id":914},{"class_id":915},{"class_id":916},{"class_id":3102}]
function retrieveUploadID(ObjArray){
  return new Promise((res, rej) =>{
    let SQLquery = "SELECT upload_id FROM uploads WHERE class_id IN (";;
    ObjArray.forEach((element, index, array) =>{
      array[index] = "'" + element[Object.keys(element)[0]] + "'";
    })
    SQLquery = SQLquery + ObjArray.join(", ") + ");";
    con.query(SQLquery, function(error, results, fields){
      if(error){
        rej(error);
      }
      else{
        res(results)
      }
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
  if(req.files == null){
    res.send(JSON.stringify("Please include a file!"));
  }
  if(tags === "undefined"){
    res.send(JSON.stringify("At least one tag must be present!"));
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
      let fileName = new Date().toJSON();
      let file = req.files.file.data;
      console.log(file)
      return [await client.files.uploadFile('240811112427', fileName, file), class_id]; //folder id
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
      res.end(JSON.stringify("That class may not exist or try to be more specific!"));
    })
  }
});

app.get("/test", async function(req, res){
  res.redirect("https://account.box.com/api/oauth2/authorize?client_id=hkoogqpabx0z8kb1m5u5dcmpo33mkzit&response_type=code&redirect_uri=http://localhost:4545/test2")
  // res.send("SUCCESS")
})

app.get("/test2", async function(req, res){
  const authenticationUrl = "https://api.box.com/oauth2/token";

  let tokens = await axios
  .post(
    authenticationUrl,
    qs.stringify({
      grant_type: "authorization_code",
      code: req.query.code,
      client_id: "hkoogqpabx0z8kb1m5u5dcmpo33mkzit",
      client_secret: "pw7HV0LTmyhFt2itiBY0xwNSIrsfgdyx",
    })
  )
  .then((response) => response.data);
  console.log(tokens)
  refresh = tokens.refresh_token
  client = sdk.getBasicClient(tokens.access_token)
  res.send("Success")
})

app.get("/getUploadID/:searchQuery", async function(req, res){
  if (req.params.searchQuery === 'random'){
    let uploadID = [];
    let uploads = await retrieveUploads();
    uploads.forEach((element) =>{
      uploadID.push(element[Object.keys(element)[0]]);
    })
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(uploadID));
  }
  else{
    // check for existence within the classes database AND tag_name database
    let upload_id;
    try {
      upload_id = await retrieveClassID(req.params.searchQuery);
    } catch (error) {
      upload_id = await retrieveUploadIDFromTags(req.params.searchQuery);
    }
    upload_id.forEach((element, i, arr)=>{
      arr[i] = element[Object.keys(element)[0]];
    })
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(upload_id));
  }
})

app.get("/getFile/:uploadID", async function(req, res){
  client.files.getReadStream(req.params.uploadID, null, async function(error, stream){
    if(error){
      res.send("ERROR");
    }
    else{
      // let string = await streamToBase64(stream);
      // res.send(string);
      stream.pipe(res);
    }
  })
})

//before fetching make sure that when you pass the array into the URL that the upload array is wrapped in JSON.stringify()
//Example output: [{"class_name":"CS 1336 ","tags":"dijkstra"},{"class_name":"CS 1336 ","tags":"newtag3"},{"class_name":"CS 1336 ","tags":"bellman-ford"},{"class_name":"CS 1336 ","tags":"sorting"},{"class_name":"CS 1336 ","tags":"mergesort"}]
app.get("/getFileInfo/:uploadArray", async function(req, res){
  let uploadArray = JSON.parse(req.params.uploadArray);
  let fileInfo = [];
  await Promise.all(
    uploadArray.map(async (element) =>{
      let object = {};
      let class_name = await retrieveClassInfo(element);
      class_name = class_name[0]["class_name"];
      object["class_name"] = class_name;
      let tag_info = await retrieveTagInfo(element);
      tag_info = Object.values(tag_info[0]);
      tag_info = tag_info.filter(n => n);
      object["tags"] = tag_info.join(", ")
      object["key"] = element;
      fileInfo.push(object);
    })
  )
  res.send(fileInfo);
})

app.get("/generalInformation/:filter", async function(req, res){
  let data;
  if(req.params.filter == "tags"){
    data = await retrieveTagNames()
  }
  else{
    data = await retrieveClassInfoUpload(req.params.filter);
    console.log(data)
  }
  let formattedData = [];
  data.forEach(element => {
    let temp = {};
    if (element[Object.keys(element)[0]] == null){
      console.log("null value")
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
    temp["label"] = (string.join(" ").trim());
    formattedClasses.push(temp)
  });
  tag_names.forEach(element => {
    let temp = {};
    temp["label"] = element.tag_name;
    formattedClasses.push(temp)
  })
  res.send(formattedClasses);
})

app.get("/nebulaTest", async function (req,res){

  
  const headers = {
    "x-api-key": retrieveSecrets()[7],
    "Accept": 'application/json',
  };
  fetch('https://api.utdnebula.com/section', {
  method: 'GET',

  headers: headers,
  })
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {

    console.log(body.data.length);
    res.send(body.data)
  });
})
