const express = require("express")
const router = express.Router()

const box_auth = require("../domains/box_auth/controller");
const redirect_auth = require("../domains/redirect/controller");
// const general_information = require("../domains/general_information");
// const get_file = require("../domains/get_file");
// const get_file_info = require("../domains/get_file_info");
// const search_format = require("../domains/search_format");
// const upload = require("../domains/upload");
// const token_refresh = require("../util/token_refresh");

let box_auth_flag = false;
let redirect = false;
let refresh = null;
let client = null;

setInterval(async () => {
    if (box_auth_flag) {
      [refresh, client] = token_refresh(refresh);
    }
}, 1000 * 60 * 15)

router.get("/box_auth/:password", async (req, res) =>{
    let return_obj = await box_auth(box_auth_flag, req.params.password);
    console.log(return_obj)
    if(return_obj.data.box_auth_flag){
        box_auth_flag = true;
        res.status(return_obj.status_code)
        res.redirect(return_obj.data.redirect_url)
    }
    else{
        res.status(return_obj.status_code)
        res.send(return_obj.response);
    }
})

router.get("/redirect", async (req, res) =>{
    let return_obj = redirect_auth(box_auth_flag, redirect);
    if(return_obj.data.box_auth_flag){
        box_auth_flag = false;
        redirect = true;
        refresh = return_obj.data.refresh;
        client = return_obj.data.client;
        res.status(return_obj.status_code)
        res.redirect(return_obj.data.redirect_url)
    }
    else{
        res.status(return_obj.status_code)
        res.send(return_obj.response);
    }
})

// router.get("/generalInformation/:filter", async (req, res) =>{

// })

// router.get("/getFile/:uploadID", async (req, res) =>{

// })

// router.get("/getFileInfo/:uploadArray", async (req, res) =>{

// })

// router.get("/searchFormat", async (req, res) =>{

// })


// router.post("/uploadSearchParameters/:coursePrefix;:classNumber;:section;:instructor;:term;:tags", async (req, res) =>{

// })


module.exports = router