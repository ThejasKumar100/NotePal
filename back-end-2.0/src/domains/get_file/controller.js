function get_read_stream(client, uploadID) {
    return new Promise((resolve, reject) => {
        client.files.getReadStream(uploadID, null, async function (error, stream) {
            if (error) {
                reject(error)
            }
            else {
                resolve(stream)
            }
        })
    })
}

async function get_file(redirect, uploadID, client) {
    let return_obj = { data: {}, response: "", status_code: "" };
    if (redirect) {
        try {
            const stream = await get_read_stream(client, uploadID);
            return_obj.status_code = 200;
            return_obj.data.streamFlag = true;
            return_obj.data.stream = stream;
        } catch (error) {
            return_obj.status_code = 201;
            return_obj.response = "Error";
            return_obj.data.error = error;
        }
    }
    else {
        return_obj.status_code = 201;
        return_obj.response = "Not Authenticated";
    }
    return return_obj;
}

module.exports = get_file;