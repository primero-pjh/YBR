const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const cfg = require(`${path}/config`);
const jwtFunc = require(`${path}/jwt`);
let CRT_ERROR_CODE = require(`${path}/error_code`);

router.post('/api/schedules', async (req, res, next) => {
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];
    // let token = req.query.token;
    let token = req.headers.authorization;
    let resJwt = await jwtFunc.verify(token);
    if(!resJwt) {
        return res.json({
            success: 0,
            isLogged: false,
            message: CRT_ERROR_CODE["LOGIN_TOKEN"],
        });
    }
    
    let schedule = req.body.params.schedule;

    let [results] = await db.query(`
        insert into schedules
        (
            coupleInfoId, calendarId, title, body, isAllday, 
            start, end, location, attendees, category,
            dueDateClass, isVisible, isPending, isFocused, isPrivate,
            dateAdded
        )
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [0, 0, schedule.title, schedule.body, (schedule.isAllday ? 1 : 0), schedule.start, schedule.end,
        schedule.location, JSON.stringify(schedule.attendees), schedule.category, schedule.dueDateClass, 1, 0,
        0, 0, new Date()
    ]);
    let id = results.insertId;
  
    return res.json({
        success: 0,
        message: '토큰이 올바르지 않습니다.',
    });
});

module.exports = router;
