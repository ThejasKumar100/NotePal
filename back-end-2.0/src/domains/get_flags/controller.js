const pool = require("../../config/db");

function get_flags_helper() {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                rej(err);
            }
            con.query(`SELECT * FROM flagged;`, function (error, results) {
                con.release();
                if (error) reject(error);
                else {
                    resolve(results);
                }
            });
        })
    })
}

async function get_flags(redirect) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        return_obj.data.flags = await get_flags_helper()
        return_obj.status_code = 200;
        return return_obj;
    }
    else{
        return_obj.response = "Not Authenticated";
        return_obj.status_code = 201;
        return return_obj;
    }
}

module.exports = get_flags;