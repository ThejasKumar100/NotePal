
async function get_file(redirect, uploadID, client, res) {
    if (redirect) {
        client.files.getReadStream(uploadID, null, async function (error, stream) {
            if (error) {
                res.status(201);
                res.send("ERROR");
            }
            else {
                res.status(200);
                stream.pipe(res)
            }
        })
    }
    else {
        res.status(201);
        res.send("Not Authenticated");
    }
}

module.exports = get_file;