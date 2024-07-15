const express = require("express")
const router = express.Router()

const box_auth = require("../domains/box_auth/controller");
const redirect_auth = require("../domains/redirect/controller");
const token_refresh = require("../util/token_refresh");
const general_information = require("../domains/general_information/controller");
const get_file = require("../domains/get_file/controller");
const get_file_info = require("../domains/get_file_info/controller");
const search_format = require("../domains/search_format/controller");
const upload = require("../domains/upload/controller");
const get_uploads = require("../domains/get_uploads/controller");
const set_flags = require("../domains/flag/controller");
const get_flags = require("../domains/get_flags/controller");
const delete_file = require("../domains/delete_file/controller");
const remove_flags = require("../domains/remove_flags/controller");

let box_auth_flag = false;
let redirect = false;
let refresh = null;
let client = null;

setInterval(async () => {
    try {
        if (redirect) {
            [refresh, client] = await token_refresh(refresh);
        }
    } catch (error) {
        console.log("Key renewal error");
    }
}, 1000 * 60 * 30)

router.get("/box_auth/:password", async (req, res) => {
    try {
        let return_obj = await box_auth(box_auth_flag, redirect, req.params.password);
        console.log(return_obj)
        if (return_obj.data.box_auth_flag != null) {
            box_auth_flag = true;
            res.status(return_obj.status_code)
            res.redirect(return_obj.data.redirect_url)
        }
        else {
            res.status(return_obj.status_code)
            res.send(return_obj.response);
        }
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/box_redirect", async (req, res) => {
    try {
        let return_obj = await redirect_auth(box_auth_flag, redirect, req.query.code);
        console.log(return_obj)
        if (return_obj.data.box_auth_flag != null) {
            box_auth_flag = false;
            redirect = true;
            [refresh, client] = await token_refresh(return_obj.data.refresh);
            res.status(return_obj.status_code)
            res.send(return_obj.response)
        }
        else {
            res.status(return_obj.status_code)
            res.send(return_obj.response);
        }
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/generalInformation/:filter", async (req, res) => {
    try {
        let return_obj = await general_information(redirect, req.params.filter);
        if (return_obj.data.search_results != null) {
            res.status(return_obj.status_code);
            res.send(return_obj.data.search_results);
        }
        else {
            res.status(return_obj.status_code)
            res.send(return_obj.response);
        }
    } catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/getFile/:uploadID", async (req, res) => {
    try {
        let return_obj = await get_file(redirect, req.params.uploadID, client);
        if (return_obj.data.streamFlag != null) {
            res.status(return_obj.status_code);
            return_obj.data.stream.pipe(res);
        }
        else {
            console.log(return_obj.data.error);
            res.status(return_obj.status_code)
            res.send(return_obj.response);
        }
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/getFileInfo/:uploadArray", async (req, res) => {
    try {
        let return_obj = await get_file_info(redirect, req.params.uploadArray);
        if (return_obj.data.fileInfo != null) {
            res.status(return_obj.status_code);
            res.send(return_obj.data.fileInfo);
        }
        else {
            res.status(return_obj.status_code)
            res.send(return_obj.response);
        }
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/searchFormat", async (req, res) => {
    try {
        let return_obj = await search_format(redirect);
        if (return_obj.data.search_results != null) {
            res.status(return_obj.status_code);
            res.send(return_obj.data.search_results);
        }
        else {
            res.status(return_obj.status_code)
            res.send(return_obj.response);
        }
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.post("/uploadSearchParameters/:coursePrefix;:classNumber;:section;:instructor;:term;:tags", async (req, res) => {
    try {
        let return_obj = await upload(redirect, req.params, req.files, client);
        console.log(return_obj)
        res.status(return_obj.status_code);
        res.send(return_obj.response);
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/getUploadID/:searchQuery", async (req, res) => {
    try {
        let return_obj = await get_uploads(redirect, req.params.searchQuery);
        if (return_obj.data.uploads != null) {
            res.status(return_obj.status_code);
            res.send(return_obj.data.uploads);
        }
        else {
            res.status(return_obj.status_code)
            res.send(return_obj.response);
        }
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/flag/:uploadID/:flagType", async (req, res) => {
    try {
        let return_obj = await set_flags(redirect, req.params.uploadID, req.params.flagType);
        res.status(return_obj.status_code)
        res.send(return_obj.response);
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/getFlags", async (req, res) => {
    try {
        let return_obj = await get_flags(redirect);
        res.status(return_obj.status_code)
        res.send(return_obj.data.flags);
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/delFile/:uploadID", async (req, res) => {
    try {
        if (req.header("x-api-key") !== process.env.API_KEY) {
            res.status(403);
            res.send("Bad key");
            return;
        }
        let return_obj = await delete_file(redirect, req.params.uploadID, client);
        res.status(return_obj.status_code)
        res.send(return_obj.response);
    }
    catch (error) {
        console.log(error)
        res.status(500);
        res.send("Server Error");
    }
})

router.get("/removeFlags/:uploadID", async (req, res) => {
    try {
        if (req.header("x-api-key") !== process.env.API_KEY) {
            res.status(403);
            res.send("Bad key");
            return;
        }
        let return_obj = await remove_flags(redirect, req.params.uploadID);
        res.status(return_obj.status_code)
        res.send(return_obj.response);
    }
    catch (error) {
        res.status(500);
        res.send("Server Error");
    }
})

module.exports = router