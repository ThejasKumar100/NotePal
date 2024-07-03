const pool = require("../../config/db");

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

async function get_uploads(redirect, searchQuery) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        let upload_id;
        try {
            upload_id = await retrieveClassID(searchQuery.replaceAll("'", "\\'"));
        } catch (error) {
            upload_id = await retrieveUploadIDFromTags(searchQuery.replaceAll("'", "\\'"));
        }
        upload_id.forEach((element, i, arr) => {
            arr[i] = element[Object.keys(element)[0]];
        })
        // return_obj.data.headers = 'Content-Type', 'application/json';
        return_obj.status_code = 200;
        return_obj.data.uploads = JSON.stringify(upload_id);
    }
    else {
        return_obj.status_code = 201;
        return_obj.response = "Not Authenticated";
    }
    return return_obj;
}

module.exports = get_uploads;