const pool = require("../../config/db");
const redis = require("../../config/redis");

async function checkCache() {
    await redis.connect();
    try {
        let response = await redis.get('searchFormat')
        if (response) {
            return JSON.parse(response);
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        redis.disconnect();
    }
}

async function addToCache(searchFormat) {
    await redis.connect();
    console.log(searchFormat.length);
    redis.set('searchFormat', JSON.stringify(searchFormat), function (err, reply) {
        if (err) console.log(err);
        else console.log(reply)
    }).then(() => {
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
                con.release(error => error ? reject(error) : resolve(error));
                if (error) rej(error);
                else {
                    res(results);
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

async function search_format(redirect) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        let cache = await checkCache();
        if (cache) {
            return_obj.data.search_results = cache;
            return_obj.status_code = 200;
            return return_obj;
        }
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
        await addToCache(formattedClasses);
        return_obj.data.search_results = formattedClasses;
        return_obj.status_code = 200;
    }
    else {
        return_obj.response = "Not Authenticated";
        return_obj.status_code = 201;
    }
    return return_obj;
}

module.exports = search_format;