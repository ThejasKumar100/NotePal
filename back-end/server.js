let express = require("express");
const mysql = require('mysql');
let app = express();

let server = app.listen(4545, function () {
    let host = server.address().address;
    let port = server.address().port;
  }); 

app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded());

let con = mysql.createConnection({
  host: "72.182.161.176",
  user: "notepal",
  password: "ThetaTauUTDNotePal2023",
  database: "notepal",
});

con.connect(function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("connection successful");
    }
});
  
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

  app.get("/class", function (req, res) {
    res.send("Hello World");
  });