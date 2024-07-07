const pool = require("../../config/db");

function updateFlags(uploadID, flagType) {

    return new Promise((res, rej) => {
        pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                rej(err);
            }
            con.query(`INSERT INTO flagged (upload_id, ${flagType}) VALUES (${uploadID}, 1) ON DUPLICATE KEY UPDATE ${flagType} = ${flagType} + 1`, function (error, results) {
                con.release(error => error ? reject(error) : resolve(error));
                if (error) rej(error);
                else {
                    res(true);
                }
            });
        })
    })
}

async function  set_flags(redirect, uploadID, flagType) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        try {
            await updateFlags(uploadID, flagType.toLowerCase());
            return_obj.response = "Success";
            return_obj.status_code = 200;
        }
        catch (error) {
            await updateFlags(uploadID, flagType.toLowerCase());
            return_obj.response = "Error";
            return_obj.status_code = 201;
        }
        return return_obj;
    }
    return_obj.response = "Not Authenticated";
    return_obj.status_code = 201;
    return return_obj;
}

module.exports = set_flags;