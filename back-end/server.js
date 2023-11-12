let express = require("express");
let app = express();
// let fs = require("fs");
// let FileReader = require("filereader");
// let mysql = require("mysql");
// let request = require("request-promise");
// const axios = require("axios");
// const { response } = require("express");

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
  
app.get("/tag_names", function (req, res) {
    console.log("sql props");
    res.send("Hello World");
    // con.query("SELECT * FROM class", function (error, rows, fields) {
    //     if (error) console.log(error);
    //     else {
    //       let array = rows;
    //       for (var i in array) {
    //         array[i].profile_image = fs.readFileSync(
    //           array[i].profile_image,
    //           "base64"
    //         );
    //       }
    //       res.send(array);
    //       // console.log(rows);
    //     }
    //   });
  });