async function box_auth_controller(box_auth_flag, redirect, password){
    let return_obj = {data: {}, response: "", status_code: ""};
    if (!redirect && !box_auth_flag && password == process.env.DB_PASSWORD) {
        return_obj.data.box_auth_flag = true;
        return_obj.data.redirect_url = `https://account.box.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=https://node.asharalvany.com/box_redirect`;
        return_obj.status_code =  300;
    }
    else if (password != process.env.DB_PASSWORD) {
        return_obj.response = "Wrong Password";
        return_obj.status_code =  401;
    }
    else {
        return_obj.response = "Authentication completed";
        return_obj.status_code =  202;
    }
    return return_obj;
}

module.exports = box_auth_controller