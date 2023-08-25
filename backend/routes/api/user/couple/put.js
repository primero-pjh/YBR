const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const cfg = require(`${path}/config`);
const jwtFunc = require(`${path}/jwt`);
let CRT_ERROR_CODE = require(`${path}/error_code`);

router.put('/api/user/couple', async function(req, res, next) {
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];
    let error = new Object();
    let waitingId = req.body.waitingId;
    let toUID = req.body.toUID;
    let fromUID = req.body.fromUID;
    if(!toUID || !fromUID) {
        return res.json({
            success: 0,
            message: "잘못된 정보거나 로그인이 잘못되었습니다. 확인 후 다시 시도하세요.",
        });
    }

    let [results] = await db.query(`
        insert into coupleInfos 
        (toUID, fromUID, image, backgroundImage, dateAdded, status)
        values
        (?, ?, ?, ?, ?, ?)
    `, [toUID, fromUID, '', '', new Date(), 1])

    let coupleInfoId = results.insertId;

    /* chatInfo 생성 */
    let [chatInfo_results] = await db.query(`
        insert into chatInfos (status, dateAdded)
        values(?, ?)
    `, [1, new Date()]);
    let chatInfoId = chatInfo_results.insertId;

    /* chatMembers 생성 */
    await db.query(`
    insert into chatMembers (chatInfoId, UID, isHost, dateAdded)
    values(?, ?, ?, ?)
    `, [chatInfoId, toUID, 0, new Date()]);
    await db.query(`
    insert into chatMembers (chatInfoId, UID, isHost, dateAdded)
    values(?, ?, ?, ?)
    `, [chatInfoId, fromUID, 0, new Date()]);

    /* appUsers의 coupleInfo 변경 */
    await db.query(`
        update appUsers
        set coupleInfoId=?, coupleUID=?
        where UID=?
    `, [coupleInfoId, fromUID, toUID]);

    /* appUsers의 coupleInfo 변경 */
    await db.query(`
        update appUsers
        set coupleInfoId=?, coupleUID=?
        where UID=?
    `, [coupleInfoId, toUID, fromUID]);

    let [rows] = await db.query(`
        select 
            u.userId, u.UID, u.phoneNumber, u.image, u.userName, u.coupleInfoId,
            ci.backgroundImage
        from appUsers as u 
        join coupleInfos as ci on u.coupleInfoId=ci.coupleInfoId
        where u.UID=? and ci.status=1
    `, [toUID]);
    let couple = rows[0];

    await db.query(`
        DELETE FROM waitings
        WHERE waitingId=?
    `, [waitingId]);

    return res.json({
        success: 1,
        couple,
        message: '커플 등록 완료!'
    });
});

module.exports = router;
