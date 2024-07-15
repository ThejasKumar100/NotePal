const pool = require("../../config/db");
const redis = require("../../config/redis");

async function clearCache() {
    await redis.connect();
    redis.del('searchFormat')
    .then(() => {
        redis.disconnect();
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
                con.release();
                if (error) rej(error);
                else {
                    res(results);
                }
            });
        })
    })
}

function updateTags(tagName) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            con.query(`INSERT INTO tag_name VALUES ('${tagName}');`, function (error, results) {
                con.release();
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
        pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            con.query(SQLquery, function (error, results) {
                con.release();
                if (error) reject(error);
                else {
                    console.log("results", results)
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

async function upload(redirect, params, files, client) {
    let return_obj = { data: {}, response: "", status_code: "" };
    return new Promise(async (resolve, reject) => {
        if (redirect) {
            console.log(JSON.parse(params.instructor)["label"].replaceAll("'", "\\'"));
            let coursePrefix = params.coursePrefix === "undefined" || params.coursePrefix === "null" ? "undefined" : JSON.parse(params.coursePrefix)["label"];
            let classNumber = params.classNumber === "undefined" || params.classNumber === "null" ? "undefined" : JSON.parse(params.classNumber)["label"];
            let section = params.section === "undefined" || params.section === "null" ? "undefined" : JSON.parse(params.section)["label"];
            let instructor = params.instructor === "undefined" || params.instructor === "null" ? "undefined" : JSON.parse(params.instructor)["label"].replaceAll("'", "\\'");
            let term = params.term === "undefined" || params.term === "null" ? "undefined" : JSON.parse(params.term)["label"];
            let tags = params.tags === "undefined" || params.tags === "null" ? "undefined" : JSON.parse(params.tags);
            if (files == null) {
                return_obj.status_code = 201;
                return_obj.response = JSON.stringify("Please include a file!");
                resolve(return_obj);
            }
            if (tags === "undefined" || tags.length == 0) {
                return_obj.status_code = 201;
                return_obj.response = JSON.stringify("At least one tag must be present!");
                resolve(return_obj);
            }
            else {
                console.log("tags", tags);
                for (let tag of tags) {
                    if (typeof (tag) == "object") {
                        tag = tag["label"];
                    }
                    if (tag.length > 19) {
                        return_obj.status_code = 201;
                        return_obj.response = JSON.stringify("Tags must be less than 20 characters");
                        resolve(return_obj);
                    }
                    const match = tag.match(/[;*@%\-'`"]+/)
                    if (match != null) {
                        return_obj.status_code = 201;
                        return_obj.response = JSON.stringify("Tags cannot contain the following [&, @, *, $, |, %, ~, -, ', `, \", ;]");
                        resolve(return_obj);
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
                        updateTags(element.toLowerCase());
                    }
                    else {
                        Arr[index] = element.toLowerCase();
                    }
                })
                checkExistence(coursePrefix, classNumber, section, instructor)
                    .then(async (results) => {
                        let class_id = results[0].class_id;
                        let fileName = new Date().toJSON();
                        let file = files.file.data;
                        console.log(`uploading ${fileName}`);
                        return [await client.files.uploadFile(`${process.env.BOX_FOLDER_ID}`, fileName, file), class_id];
                    })
                    .then((response) => {
                        console.log(`upload complete`);
                        let formattedTags = tagFormatting(tags);
                        let SQLquery = `INSERT INTO uploads VALUES(${response[1]}, ${response[0].entries[0].id}, ${formattedTags});`;
                        pool.getConnection((err, con) => {
                            if (err) {
                                console.log(err)
                                throw new Error(err)
                            }
                            con.query(SQLquery, function (error, results, fields) {
                                console.log("DB Updated")
                                clearCache();
                                if (error) console.log(error);
                            })
                            return_obj.status_code = 200;
                            console.log("Success");
                            return_obj.response = JSON.stringify("SUCCESS");
                            resolve(return_obj)
                        })
                    })
                    .catch((error) => {
                        console.log("CATCH")
                        console.log(error);
                        return_obj.status_code = 201;
                        return_obj.response = JSON.stringify("That class does not exist!");
                        resolve(return_obj)
                    })
            }
        }
        else {
            console.log("Not Authenticated")
            return_obj.response = "Not Authenticated";
            return_obj.status_code = 201;
            resolve(return_obj)
        }
    })
}

module.exports = upload;