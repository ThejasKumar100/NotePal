const pool = require("../../config/db");

function delete_flags(uploadID){
    return new Promise((resolve, reject) =>{
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

async function remove_flags(redirect, uploadID){
    let return_obj = { data: {}, response: "", status_code: "" };
    if(redirect){
        try {
            await delete_flags(uploadID);
            return_obj.response = `${uploadID} flags removed`;
            return_obj.status_code = 200;
        }
        catch (error) {
            console.log(error);
            return_obj.response = `An error occurred`;
            return_obj.status_code = 201;
        }
        finally {
            return return_obj;
        }
    }
    else{
        return_obj.response = "Not Authenticated";
        return_obj.status_code = 201;
        return return_obj;
    }
}

module.exports = remove_flags;