const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const knex = require(`${path}/db`);
const cfg = require(`${path}/config`);
const jwtFunc = require(`${path}/jwt`);
let CRT_ERROR_CODE = require(`${path}/error_code`);

router.post('/api/user/waiting', async function(req, res, next) {
    let user_dict = require(`${path}/app`)["user_dict"];
    let error = new Object();
    let targetCode = req.body.targetCode;
    if(!targetCode) {
        error["targetCode"] = "코드를 입력해주세요.";
    }

    if(Object.keys(error).length > 0) {
        return res.json({
            success: 0,
            error,
        });
    }

    let [rows, fields] = await db.query(`
        select u.*
        from appUsers as u
        where u.code=?
    `, [targetCode]);
    
    console.log("rows:", rows);
    
    return res.json({
        success: 1,
    });
});

module.exports = router;
