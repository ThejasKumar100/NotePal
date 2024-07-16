const box_auth_controller = require("./controller");

test("box authorization is successful", async () => {
    let return_obj = await box_auth_controller(false, false, process.env.DB_PASSWORD)
    expect(return_obj.data.box_auth_flag).toBeTruthy();
    expect(return_obj.data.redirect_url).toBeDefined();
    expect(return_obj.status_code).toBe(300);
    expect(return_obj.response).toBe("");
})

test("box authorization has an incorrect password", async () => {
    let return_obj = await box_auth_controller(true, false, "WRONGPASS")
    expect(return_obj.data.box_auth_flag).toBeUndefined();
    expect(return_obj.data.redirect_url).toBeUndefined();
    expect(return_obj.status_code).toBe(401);
    expect(return_obj.response).toBe("Wrong Password");
})

test("box authorization is successful", async () => {
    let return_obj = await box_auth_controller(true, false, process.env.DB_PASSWORD)
    expect(return_obj.data.box_auth_flag).toBeUndefined();
    expect(return_obj.data.redirect_url).toBeUndefined();
    expect(return_obj.status_code).toBe(202);
    expect(return_obj.response).toBe("Authentication completed");
})