const pool = require("../../config/db");

function delete_box_file(client, uploadID) {
    return new Promise((resolve, reject) => {
        client.files.delete(`${uploadID}`)
            .then(() => {
                resolve();
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    })
}

function delete_flags(uploadID) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            con.query(`DELETE FROM flagged WHERE upload_id = ${uploadID};`, function (error, results) {
                con.release();
                if (error) reject(error);
                else {
                    resolve(results);
                }
            });
        })
    })
}

function delete_upload(uploadID) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            con.query(`DELETE FROM uploads WHERE upload_id = ${uploadID};`, function (error, results) {
                con.release();
                if (error) rej(error);
                else {
                    resolve(results);
                }
            });
        })
    })
}

async function delete_file(redirect, uploadID, client) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        try {
            await delete_flags(uploadID);
            await delete_upload(uploadID);
            return_obj.response = `${uploadID} removed`;
            return_obj.status_code = 200;
        }
        catch (error) {
            return_obj.response = error;
            return_obj.status_code = 201;
        }
        finally {
            return return_obj;
        }

    }
    else {
        return_obj.response = "Not Authenticated";
        return_obj.status_code = 201;
        return return_obj;
    }
}

module.exports = delete_file;