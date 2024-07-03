const axios = require('axios');
const qs = require("querystring");
const box_sdk = require("../config/box");

async function token_refresh(refresh){
    const authenticationUrl = "https://api.box.com/oauth2/token";

    let tokens = await axios
    .post(
        authenticationUrl,
        qs.stringify({
            grant_type: "refresh_token",
            refresh_token: refresh,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        })
    )
    .then((response) => response.data);
    console.log("TIME: ", new Date(Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago' }))
    console.log(tokens)
    let new_refresh = tokens.refresh_token
    client = box_sdk.getBasicClient(tokens.access_token);
    return [new_refresh, client];
}

module.exports = token_refresh