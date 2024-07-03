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
        console.log("search_format");
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
        return_obj.data.search_results = formattedClasses;
        return_obj.status_code = 200;
        return_obj.response = "Not Authenticated";
    }
    else {
        return_obj.response = "Not Authenticated";
        return_obj.status_code = 201;
    }
    return return_obj;
}

module.exports = search_format;