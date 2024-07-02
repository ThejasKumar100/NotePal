const BoxSDK = require('box-node-sdk');

let box_sdk = null;
function est_box_conn(){
    box_sdk = new BoxSDK({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });
    return box_sdk;
}

module.exports = est_box_conn();