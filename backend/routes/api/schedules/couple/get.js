const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const cfg = require(`${path}/config`);
const jwtFunc = require(`${path}/jwt`);
let CRT_ERROR_CODE = require(`${path}/error_code`);

/*
    schedule list를 읽어오는 controller
*/
router.get('/api/schedules/couple/:coupleInfoId', async (req, res, next) => {
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];
    let coupleInfoId = req.params.coupleInfoId;

    let [rows, fields] = await db.query(`
        select s.*
        from schedules as s
        where s.coupleInfoId=? and status=?
    `, [coupleInfoId, 1]);
    
    return res.json({
        success: 1,
        schedule_list: rows,
    });
});

module.exports = router;
