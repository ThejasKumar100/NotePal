const axios = require('axios');
const qs = require("querystring")
const token_refresh = require("../../util/token_refresh");

async function redirect_controller(box_auth_flag, redirect, code){
    let return_obj = {data: {}, response: "", status_code: ""};
    if (!redirect && box_auth_flag) {
        const authenticationUrl = "https://api.box.com/oauth2/token";
        let tokens = await axios
        .post(
            authenticationUrl,
            qs.stringify({
            grant_type: "authorization_code",
            code: code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            })
        )
        .then((response) => response.data);
        console.log("TIME: ", new Date(Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago' }))
        console.log(tokens)
        return_obj.data.box_auth_flag = false;
        return_obj.data.redirect = true;
        return_obj.data.refresh = tokens.refresh_token;
        return_obj.response = "Success";
        return_obj.status_code = 200;
    }
    else if (!redirect) {
        return_obj.response = "Box has not been authorized";
        return_obj.status_code = 201;
    }
    else {
        return_obj.response = "Authentication already completed";
        return_obj.status_code = 201;
    }
    return return_obj;
}

module.exports = redirect_controller