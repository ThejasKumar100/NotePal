const pool = require("../../config/db");

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

function retrieveClassInfoUpload(string) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con)=>{
        if(err){
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

async function general_information(redirect, filter) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        let data;
        if (filter == "tags") {
            data = await retrieveTagNames()
        }
        else {
            data = await retrieveClassInfoUpload(filter);
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
        return_obj.status_code = 200;
        return_obj.data.search_results = formattedData;
    }
    else {
        return_obj.response = "Not Authenticated";
        return_obj.status_code = 201;
    }
    return return_obj;
}

module.exports = general_information