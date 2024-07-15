const pool = require("../../config/db");

function retrieveClassInfo(upload_id) {
    return new Promise((res, rej) => {
        let SQLquery = `SELECT CONCAT(COALESCE(course_prefix, ''), ' ', COALESCE(class_number, ''), ' ', COALESCE(instructor, '')) AS class_name FROM class WHERE class_id=(SELECT class_id FROM uploads WHERE upload_id=${upload_id});`
        pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                rej(err);
            }
            con.query(SQLquery, function (error, results) {
                con.release();
                if (error) rej(error);
                else { res(results); }
            });
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
                con.release();
                if (error) rej(error);
                else { res(results); }
            });
        })
    })
}

async function get_file_info(redirect, _uploadArray) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        let uploadArray = JSON.parse(_uploadArray);
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
        return_obj.status_code = 200;
        return_obj.data.fileInfo = fileInfo;
    }
    else {
        return_obj.status_code = 201;
        return_obj.response = "Not Authenticated";
    }
    return return_obj;
}

module.exports = get_file_info;