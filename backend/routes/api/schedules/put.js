const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const cfg = require(`${path}/config`);
const jwtFunc = require(`${path}/jwt`);
let CRT_ERROR_CODE = require(`${path}/error_code`);

router.put('/api/schedules/:scheduleId', async (req, res, next) => {
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];
    
    let scheduleId = req.params.scheduleId;
    console.log("scheduleId:", scheduleId);
    let schedule = req.body.params.schedule;

    let error = new Object();
    if(!schedule.title) {
        schedule.title = '(제목없음)';
    }

    let [results] = await db.query(`
        update schedules
        set calendarId=?, title=?, body=?, isAllday=?, start=?,
            end=?, location=?, attendees=?, category=?, dueDateClass=?,
            isVisible=?, isPending=?, isFocused=?, isPrivate=?, classification=?
        where id=?
    `, [
        schedule.calendarId, schedule.title, schedule.body, (schedule.isAllday ? 1 : 0), schedule.start, 
        schedule.end, schedule.location, JSON.stringify(schedule.attendees), schedule.category, schedule.dueDateClass, 
        1, 0, 0, 0, scheduleId, schedule.classification
    ]);
  
    return res.json({
        success: 1,
        message: '수정하였습니다.',
    });
});

module.exports = router;
