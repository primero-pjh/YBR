const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const crypto = require('crypto');
const cfg = require(`${path}/config`);
const jwt = require('jsonwebtoken');
let CRT_ERROR_CODE = require(`${path}/error_code`);

function hashTest(salt, password) {
    // const salt = crypto.randomBytes(32).toString('hex');
    return crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');
}
/* 
    user의 login controller
*/
router.post('/api/user/login', async function(req, res, next) {
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];
    let userId = req.body.params.userId;
    let password = req.body.params.password;
    let rememberMe = req.body.params.rememberMe;
    
    let error = new Object();
    if(!userId) { error["userId"] = "필수입력 항목입니다!"; }
    if(!password) { error["password"] = "필수입력 항목입니다!"; }
    if(Object.keys(error).length > 0) {
        return res.json({
            success: 0,
            error: error,
        });
    }
    /* 암호화 */
    let [rows, fields] = await db.query(`
        select u.userId, u.UID, u.spousePhoneNumber, u.phoneNumber, u.image, u.userName, 
                u.isAdmin, u.coupleInfoId, u.password,
                us.salt
        from appUsers as u 
        join userSalts as us on u.UID=us.UID
        where u.userId=?`, 
        [userId]);
    let user = rows[0];
    /* user null check */
    if(!user) {
        error["userId"] = "존재하지 않는 아이디거나, 비밀번호가 일치하지 않습니다.";
        return res.json({
            success: 0,
            error,
        });
    }
    password = hashTest(user.salt, password);
    if(password != user.password) {
        error["userId"] = "존재하지 않는 아이디거나, 비밀번호가 일치하지 않습니다.";
        return res.json({
            success: 0,
            error,
        });
    }

    /* get couple info */
    // let couple = null;
    // if(user.spousePhoneNumber) {
    //     couple = await knex.table('appUsers as u')
    //     .select('u.userId', 'u.UID', 'u.spousePhoneNumber', 'u.phoneNumber', 'u.image', 
    //         'u.userName', 'u.coupleInfoId', 'ci.backgroundImage')
    //     .join('coupleInfos as ci', 'u.coupleInfoId', '=', 'ci.coupleInfoId')
    //     .where('u.phoneNumber', user.spousePhoneNumber).first();
    // }
    
    // /* set cookie */
    let APP_ACC_TKN = null; // access_token
    let APP_REF_TKN = null; // refresh_token
    rememberMe = 1;
    if(rememberMe == 1) {
        APP_ACC_TKN = jwt.sign({ 
            userId: userId,
            UID: user.UID
        }, 
        cfg.jwtKey, 
        {
            expiresIn: "1 hours",
        });
        res.cookie('APP_ACC_TKN', APP_ACC_TKN);

        APP_REF_TKN = jwt.sign({ 
            userId: userId,
            UID: user.UID
        }, 
        cfg.jwtKey, 
        {
            expiresIn: "14 days",
        });
        res.cookie('APP_REF_TKN', APP_REF_TKN);
    }

    // /* couple socketId */
    // let coupleSocketId = "";
    // if(couple) {
    //     if(user_dict.hasOwnProperty(couple.phoneNumber)) {
    //         coupleSocketId = user_dict[couple.phoneNumber].socketId;
    //     }
    // }

    return res.json({
        success: 1,
        token: {
            APP_ACC_TKN,
            APP_REF_TKN
        },
        // user,
        // couple,
        // coupleSocketId,
    });
});

module.exports = router;
