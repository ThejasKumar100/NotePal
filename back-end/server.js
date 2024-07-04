const express = require("express");
const fs = require('node:fs');
const app = express();
const mysql = require('mysql');
const BoxSDK = require('box-node-sdk');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const qs = require("querystring")

var key = fs.readFileSync('/home/ash/Projects/ashar/ssl/asharalvany.key');
var cert = fs.readFileSync('/home/ash/Projects/ashar/ssl/asharalvany_com.crt');
var ca = fs.readFileSync('/home/ash/Projects/ashar/ssl/asharalvany.ca-bundle');

var httpsOptions = {
  key: key,
  cert: cert,
  ca: ca
};

let secrets;
function retrieveSecrets() {
  return new Promise((resolve, reject) => {
    fs.readFile('.secrets', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        arr = []
        data.split("\n").forEach(element => {
          arr.push(element.trim())
        });
        resolve(arr)
      }
    });
  })


}

let var_ready = false;
let test2 = false;
let con;
let server;
let sdk;
let client;
let refresh;

async function connEst() {
  // retrieveSecrets().then((result) => {
  // secrets = result;
  // con.query("SELECT  1;");
  // con.connect(function (error) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("con successful");
  //   }
  // });
  // });
  const authenticationUrl = "https://api.box.com/oauth2/token";

  let tokens = await axios
    .post(
      authenticationUrl,
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh,
        client_id: secrets[5],
        client_secret: secrets[6],
      })
    )
    .then((response) => response.data);
  console.log("TIME: ", new Date(Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago' }))
  console.log(tokens)
  refresh = tokens.refresh_token
  client = sdk.getBasicClient(tokens.access_token)
}

setInterval(async () => {
  if (var_ready) {
    connEst();
  }
}, 1000 * 60 * 15)


server = app.listen(4545, () => { });

// https.createServer(httpsOptions, app).listen(4545, ()=>{});

retrieveSecrets().then((result) => {
  secrets = result;

  pool = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host: secrets[1],
    user: secrets[2],
    password: secrets[3],
    database: secrets[4],
  });

  //   server = app.listen(4545, ()=>{}); 

  //   con.connect(function (error) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("con successful");
  //     }
  //   });

  sdk = new BoxSDK({
    clientID: secrets[5],
    clientSecret: secrets[6]
  });
  //   //Developer Token
  //   client = sdk.getBasicClient('kQ9s1QDFmx3a5c9Qmoc0QtOZUiAMoUae');
})

const cors = require("cors");
const { type } = require("node:os");
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());


function updateTags(tagName) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      con.query(`INSERT INTO tag_name VALUES ('${tagName}');`, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) reject(error);
        else {
          resolve(results);
        }
      });
    })
  })
}

function SQLequivalenceFormat(value) {
  if (value === "undefined") {
    return "IS NULL";
  }
  else {
    return `= '${value}'`
  }
}

function checkExistence(coursePrefix, classNumber, section, instructor) {
  return new Promise((resolve, reject) => {
    let SQLquery = `SELECT * FROM class WHERE course_prefix ${SQLequivalenceFormat(coursePrefix)} AND class_number ${SQLequivalenceFormat(classNumber)} AND instructor ${instructor == "undefined" ? "IS NULL" : "LIKE '" + instructor + "%'"}`;
    console.log(`${SQLquery}`);
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      con.query(SQLquery, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) reject(error);
        else {
          resolve(results);
        }
      });
    })
  })
}

function tagFormatting(tags) {
  let formattedTags = Array(15).fill("NULL");
  for (let i = 0; i < tags.length; i++) {
    formattedTags[i] = "'" + tags[i] + "'";
  }
  return formattedTags.join(", ")
}

function retrieveClassInfoUpload(string) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      con.query(`SELECT DISTINCT ${string} FROM class;`, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
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
  })
}

function retrieveDistinctClasses() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      con.query("SELECT DISTINCT course_prefix, class_number, instructor FROM class ORDER BY term;", function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) reject(error);
        else {
          resolve(results);
        }
      });
    })
  })
}

function retrieveTagNames() {
  return new Promise((res, rej) => {
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      con.query("SELECT * FROM tag_name", function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) rej(error);
        else {
          res(results);
        }
      });
    })
  })
}

function retrieveUploads() {
  return new Promise((res, rej) => {
    let SQLquery = `SELECT upload_id FROM uploads`;
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      con.query(SQLquery, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) rej(error);
        else { res(results); }
      })
    })
  })
}

function retrieveClassInfo(upload_id) {
  return new Promise((res, rej) => {
    let SQLquery = `SELECT CONCAT(COALESCE(course_prefix, ''), ' ', COALESCE(class_number, ''), ' ', COALESCE(instructor, '')) AS class_name FROM class WHERE class_id=(SELECT class_id FROM uploads WHERE upload_id=${upload_id});`
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      con.query(SQLquery, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) rej(error);
        else { res(results); }
      });
    })
  })
}

function retrieveUploadIDFromTags(tag_name) {
  return new Promise((res, rej) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    tag_name = tag_name.replace(reg, (match) => (map[match]));
    let SQLquery = `SELECT upload_id FROM uploads WHERE tag_name_1 LIKE '%${tag_name}%' OR tag_name_2 LIKE '%${tag_name}%' OR tag_name_3 LIKE '%${tag_name}%' OR tag_name_4 LIKE '%${tag_name}%' OR tag_name_5 LIKE '%${tag_name}%' OR tag_name_6 LIKE '%${tag_name}%' OR tag_name_7 LIKE '%${tag_name}%' OR tag_name_8 LIKE '%${tag_name}%' OR tag_name_9 LIKE '%${tag_name}%' OR tag_name_10 LIKE '%${tag_name}%' OR tag_name_11 LIKE '%${tag_name}%' OR tag_name_12 LIKE '%${tag_name}%' OR tag_name_13 LIKE '%${tag_name}%' OR tag_name_14 LIKE '%${tag_name}%' OR tag_name_15 LIKE '%${tag_name}%';`;
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      con.query(SQLquery, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) rej(error);
        else { res(results); }
      })
    })
  })
}

function retrieveTagInfo(upload_id) {
  return new Promise((res, rej) => {
    let SQLquery = `SELECT tag_name_1,tag_name_2,tag_name_3,tag_name_4,tag_name_5,tag_name_6,tag_name_7,tag_name_8,tag_name_9,tag_name_10,tag_name_11,tag_name_12,tag_name_13,tag_name_14,tag_name_15 FROM uploads WHERE upload_id=${upload_id};`
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      con.query(SQLquery, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) rej(error);
        else { res(results); }
      });
    })
  })
}

function retrieveClassID(class_name) {
  return new Promise((res, rej) => {
    let SQLquery = `SELECT class_id FROM (SELECT class_id, CONCAT(COALESCE(course_prefix, ''), ' ', COALESCE(class_number, ''), ' ', COALESCE(instructor, '')) AS class_name FROM class HAVING class_name LIKE '%${class_name}%') AS t;`;
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      con.query(SQLquery, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) rej(error);
        else {
          // needs to be completed running a SELECT upload_id FROM uploads WHERE class_id=''; for each returned class_id
          res(retrieveUploadID(results));
        }
      })
    })
  })
}

// sample input [{"class_id":914},{"class_id":915},{"class_id":916},{"class_id":3102}]
function retrieveUploadID(ObjArray) {
  return new Promise((res, rej) => {
    let SQLquery = "SELECT upload_id FROM uploads WHERE class_id IN (";;
    ObjArray.forEach((element, index, array) => {
      array[index] = "'" + element[Object.keys(element)[0]] + "'";
    })
    SQLquery = SQLquery + ObjArray.join(", ") + ");";
    pool.getConnection((err, con) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      con.query(SQLquery, function (error, results) {
        con.release(error => error ? reject(error) : resolve(error));
        if (error) {
          rej(error);
        }
        else {
          res(results)
        }
      })
    })
  })
}

//possible bug: a file with the same name as another uploaded will result in an error
app.post("/uploadSearchParameters/:coursePrefix;:classNumber;:section;:instructor;:term;:tags", async function (req, res) {
  if (!var_ready) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify("Not Authenticated"));
    return;
  }
  // Will show as undefined if unavailable
  console.log(req.params.instructor["label"]);
  let coursePrefix = req.params.coursePrefix === "undefined" || req.params.coursePrefix === "null" ? "undefined" : JSON.parse(req.params.coursePrefix)["label"];
  let classNumber = req.params.classNumber === "undefined" || req.params.classNumber === "null" ? "undefined" : JSON.parse(req.params.classNumber)["label"];
  let section = req.params.section === "undefined" || req.params.section === "null" ? "undefined" : JSON.parse(req.params.section)["label"];
  let instructor = req.params.instructor === "undefined" || req.params.instructor === "null" ? "undefined" : JSON.parse(req.params.instructor)["label"].replaceAll("'", "\\'");
  let term = req.params.term === "undefined" || req.params.term === "null" ? "undefined" : JSON.parse(req.params.term)["label"];
  let tags = req.params.tags === "undefined" || req.params.tags === "null" ? "undefined" : JSON.parse(req.params.tags);
  if (req.files == null) {
    res.send(JSON.stringify("Please include a file!"));
    return
  }
  if (tags === "undefined") {
    res.send(JSON.stringify("At least one tag must be present!"));
    return
  }
  else {
    console.log(tags)
    for (let tag of tags) {
      if (typeof (tag) == "object") {
        tag = tag["label"];
      }
      if (tag.length > 19) {
        console.log("tag large input");
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify("Tags must be less than 20 characters"));
        return;
      }
      console.log(tag)
      const match = tag.match(/[;*@%\-'`"]+/)
      if (match != null) {
        console.log("tag malicious input");
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify("Tags cannot contain the following [&, @, *, $, |, %, ~, -, ', `, \", ;]"));
        return;
      }
    };
    let currentTags = await retrieveTagNames();
    currentTags.forEach((element, index, arr) => {
      arr[index] = element[Object.keys(element)[0]]
    })
    for (let i = 0; i < tags.length; i++) {
      if ((typeof tags[i] === "object")) {
        tags[i] = tags[i]["label"];
      }
    }
    tags.forEach((element, index, Arr) => {
      if (!currentTags.includes(element.toLowerCase())) {
        console.log(`current tags: ${currentTags}`);
        console.log(`new tag: ${element}`);
        updateTags(element.toLowerCase());
      }
      else {
        Arr[index] = element.toLowerCase();
      }
    })
    checkExistence(coursePrefix, classNumber, section, instructor)
      .then(async (results) => {
        console.log(results)
        let class_id = results[0].class_id;
        let fileName = new Date().toJSON();
        let file = req.files.file.data;
        console.log(file)
        return [await client.files.uploadFile('240811112427', fileName, file), class_id]; //folder id
      })
      .then((response) => {
        let formattedTags = tagFormatting(tags);
        let SQLquery = `INSERT INTO uploads VALUES(${response[1]}, ${response[0].entries[0].id}, ${formattedTags});`;
        console.log(SQLquery);
        pool.getConnection((err, con) => {
          if (err) {
            console.log(err)
            throw new Error(err)
          }
          con.query(SQLquery, function (error, results, fields) {
            con.release(error => error ? reject(error) : resolve(error));
            if (error) console.log(error);
          })
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify("SUCCESS"));
        })
      })
      .catch((error) => {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify("That class does not exist!"));
      })
  }
});

app.get("/", async function (req, res) {
  res.send("Alekhyaa wuz here <3");
})

app.get("/box_auth/:password", async function (req, res) {
  if (!var_ready && req.params.password == secrets[3]) {
    test2 = true;
    res.redirect(`https://account.box.com/api/oauth2/authorize?client_id=${secrets[5]}&response_type=code&redirect_uri=https://node.asharalvany.com/box_redirect`)
  }
  else if (req.params.password != secrets[3]) {
    res.send("Wrong Password")
  }
  else {
    res.send("Authentication completed")
  }
  // res.send("SUCCESS")
})

app.get("/box_redirect", async function (req, res) {
  if (!var_ready && test2) {
    const authenticationUrl = "https://api.box.com/oauth2/token";
    let tokens = await axios
      .post(
        authenticationUrl,
        qs.stringify({
          grant_type: "authorization_code",
          code: req.query.code,
          client_id: secrets[5],
          client_secret: secrets[6],
        })
      )
      .then((response) => response.data);
    console.log("TIME: ", new Date(Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago' }))
    console.log(tokens)
    refresh = tokens.refresh_token
    connEst();
    test2 = false;
    var_ready = true;
    res.send("Success")
  }
  else if (!test2) {
    res.send("Prerequisite not met")
  }
  else {
    res.send("Authentication already completed")
  }
})
app.get("/getUploadID/:searchQuery", async function (req, res) {
  if (!var_ready) {
    res.send("Not Authenticated");
    return;
  }
  if (req.params.searchQuery === 'random') {
    let uploadID = [];
    let uploads = await retrieveUploads();
    uploads.forEach((element) => {
      uploadID.push(element[Object.keys(element)[0]]);
    })
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(uploadID));
  }
  else {
    // check for existence within the classes database AND tag_name database
    let upload_id;
    try {
      upload_id = await retrieveClassID(req.params.searchQuery.replaceAll("'", "\\'"));
    } catch (error) {
      upload_id = await retrieveUploadIDFromTags(req.params.searchQuery.replaceAll("'", "\\'"));
    }
    upload_id.forEach((element, i, arr) => {
      arr[i] = element[Object.keys(element)[0]];
    })
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(upload_id));
  }
})

app.get("/getFile/:uploadID", async function (req, res) {
  if (!var_ready) {
    res.send("Not Authenticated");
    return;
  }
  client.files.getReadStream(req.params.uploadID, null, async function (error, stream) {
    if (error) {
      res.send("ERROR");
    }
    else {
      // let string = await streamToBase64(stream);
      // res.send(string);
      stream.pipe(res);
    }
  })
})

//before fetching make sure that when you pass the array into the URL that the upload array is wrapped in JSON.stringify()
//Example output: [{"class_name":"CS 1336 ","tags":"dijkstra"},{"class_name":"CS 1336 ","tags":"newtag3"},{"class_name":"CS 1336 ","tags":"bellman-ford"},{"class_name":"CS 1336 ","tags":"sorting"},{"class_name":"CS 1336 ","tags":"mergesort"}]
app.get("/getFileInfo/:uploadArray", async function (req, res) {
  if (!var_ready) {
    res.send("Not Authenticated");
    return;
  }
  let uploadArray = JSON.parse(req.params.uploadArray);
  let fileInfo = [];
  await Promise.all(
    uploadArray.map(async (element) => {
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

app.get("/generalInformation/:filter", async function (req, res) {
  if (!var_ready) {
    res.send("Not Authenticated");
    return;
  }
  let data;
  if (req.params.filter == "tags") {
    data = await retrieveTagNames()
  }
  else {
    data = await retrieveClassInfoUpload(req.params.filter);
    console.log(data)
  }
  let formattedData = [];
  data.forEach(element => {
    let temp = {};
    if (element[Object.keys(element)[0]] == null) {
      console.log("null value")
      return;
    }
    temp["label"] = element[Object.keys(element)[0]];
    formattedData.push(temp);
  });
  res.send(formattedData);
})

app.get("/searchFormat", async function (req, res) {
  if (!var_ready) {
    res.send("Not Authenticated");
    return;
  }
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